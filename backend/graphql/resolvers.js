const bcrypt = require("bcryptjs");
const { GraphQLError } = require("graphql");
const { signToken, verifyToken } = require("./auth");
const { getFirebaseAuth } = require("./firebaseAdmin");

const pad3 = (value) => String(value).padStart(3, "0");

const mapStaff = (row) => ({
  id: row.id,
  employeeId: row.employee_id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone,
  department: row.department,
  role: row.role,
  createdAt: row.created_at.toISOString(),
});

const getNextStaffNumber = async (pool) => {
  const query = `
    SELECT COALESCE(MAX(CAST(SUBSTRING(employee_id FROM 4) AS INTEGER)), 0) AS max_id
    FROM staff_registrations
    WHERE employee_id ~ '^EMP[0-9]+$'
  `;
  const result = await pool.query(query);
  return Number(result.rows[0].max_id) + 1;
};

const ensureCustomerAuthTable = async (pool) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customer_auth_users (
      id BIGSERIAL PRIMARY KEY,
      firebase_uid VARCHAR(128) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      display_name VARCHAR(255),
      provider VARCHAR(50) NOT NULL,
      is_disabled BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const mapCustomerAuthUser = (row) => ({
  id: row.id,
  firebaseUid: row.firebase_uid,
  email: row.email,
  displayName: row.display_name,
  provider: row.provider,
  isDisabled: row.is_disabled,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

const createResolvers = (pool) => ({
  health: "ok",
  message: "Sri GraphQL backend is running",
  dbTime: async () => {
    const result = await pool.query("SELECT NOW() AS now");
    return result.rows[0].now.toISOString();
  },
  nextEmployeeId: async () => {
    const nextNumber = await getNextStaffNumber(pool);
    return `EMP${pad3(nextNumber)}`;
  },
  nextPassword: async () => {
    const nextNumber = await getNextStaffNumber(pool);
    return `E${pad3(nextNumber)}`;
  },
  me: async (_args, context) => {
    if (!context?.token) return null;
    try {
      const decoded = verifyToken(context.token);
      const result = await pool.query(
        `SELECT id, employee_id, full_name, email, phone, department, role, created_at
         FROM staff_registrations
         WHERE id = $1`,
        [decoded.sub]
      );
      if (!result.rows[0]) return null;
      return mapStaff(result.rows[0]);
    } catch (_error) {
      return null;
    }
  },
  staffUsers: async () => {
    const result = await pool.query(
      `SELECT id, employee_id, full_name, email, phone, department, role, created_at
       FROM staff_registrations
       ORDER BY id DESC`
    );
    return result.rows.map(mapStaff);
  },
  customerAuthUsers: async () => {
    await ensureCustomerAuthTable(pool);
    const result = await pool.query(
      `SELECT id, firebase_uid, email, display_name, provider, is_disabled, created_at, updated_at
       FROM customer_auth_users
       ORDER BY id DESC`
    );
    return result.rows.map(mapCustomerAuthUser);
  },
  registerStaff: async ({ fullName, email, phone, department, role }) => {
    const nextNumber = await getNextStaffNumber(pool);
    const employeeId = `EMP${pad3(nextNumber)}`;
    const tempPassword = `E${pad3(nextNumber)}`;
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const insertQuery = `
      INSERT INTO staff_registrations (
        employee_id,
        password_hash,
        full_name,
        email,
        phone,
        department,
        role
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, employee_id, full_name, email, phone, department, role, created_at
    `;

    const result = await pool.query(insertQuery, [
      employeeId,
      passwordHash,
      fullName,
      email,
      phone ?? null,
      department,
      role,
    ]);

    return {
      staff: mapStaff(result.rows[0]),
      tempPassword,
    };
  },
  loginStaff: async ({ employeeId, password }) => {
    const result = await pool.query(
      `SELECT id, employee_id, password_hash, full_name, email, phone, department, role, created_at
       FROM staff_registrations
       WHERE employee_id = $1`,
      [employeeId]
    );

    const staff = result.rows[0];
    if (!staff) {
      throw new GraphQLError("Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, staff.password_hash);
    if (!isValid) {
      throw new GraphQLError("Invalid credentials");
    }

    return {
      token: signToken(staff),
      staff: mapStaff(staff),
    };
  },
  syncCustomerAuthUser: async ({ idToken }) => {
    await ensureCustomerAuthTable(pool);
    const firebaseAuth = getFirebaseAuth();
    const decoded = await firebaseAuth.verifyIdToken(idToken, true);
    const user = await firebaseAuth.getUser(decoded.uid);
    const provider = user.providerData?.[0]?.providerId || "password";

    const result = await pool.query(
      `INSERT INTO customer_auth_users (
         firebase_uid, email, display_name, provider, is_disabled, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (firebase_uid)
       DO UPDATE SET
         email = EXCLUDED.email,
         display_name = EXCLUDED.display_name,
         provider = EXCLUDED.provider,
         is_disabled = EXCLUDED.is_disabled,
         updated_at = NOW()
       RETURNING id, firebase_uid, email, display_name, provider, is_disabled, created_at, updated_at`,
      [user.uid, user.email || "", user.displayName || null, provider, !!user.disabled]
    );

    return mapCustomerAuthUser(result.rows[0]);
  },
  setCustomerAccountDisabled: async ({ firebaseUid, disabled }) => {
    await ensureCustomerAuthTable(pool);
    const firebaseAuth = getFirebaseAuth();
    await firebaseAuth.updateUser(firebaseUid, { disabled });
    const user = await firebaseAuth.getUser(firebaseUid);

    const result = await pool.query(
      `UPDATE customer_auth_users
       SET is_disabled = $2, updated_at = NOW()
       WHERE firebase_uid = $1
       RETURNING id, firebase_uid, email, display_name, provider, is_disabled, created_at, updated_at`,
      [firebaseUid, !!user.disabled]
    );

    if (!result.rows[0]) {
      const fallbackInsert = await pool.query(
        `INSERT INTO customer_auth_users (
           firebase_uid, email, display_name, provider, is_disabled, created_at, updated_at
         ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING id, firebase_uid, email, display_name, provider, is_disabled, created_at, updated_at`,
        [
          user.uid,
          user.email || "",
          user.displayName || null,
          user.providerData?.[0]?.providerId || "password",
          !!user.disabled,
        ]
      );
      return mapCustomerAuthUser(fallbackInsert.rows[0]);
    }

    return mapCustomerAuthUser(result.rows[0]);
  },
  deleteCustomerAccount: async ({ firebaseUid }) => {
    await ensureCustomerAuthTable(pool);
    const firebaseAuth = getFirebaseAuth();
    await firebaseAuth.deleteUser(firebaseUid);
    await pool.query("DELETE FROM customer_auth_users WHERE firebase_uid = $1", [firebaseUid]);
    return true;
  },
});

module.exports = { createResolvers };
