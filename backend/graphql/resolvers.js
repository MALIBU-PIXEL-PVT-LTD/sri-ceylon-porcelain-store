/* eslint-disable @typescript-eslint/no-require-imports */
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
  isDisabled: row.is_disabled,
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

const ensureStaffTableColumns = async (pool) => {
  await pool.query(`
    ALTER TABLE staff_registrations
    ADD COLUMN IF NOT EXISTS is_disabled BOOLEAN NOT NULL DEFAULT FALSE
  `);
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

const reconcileCustomerAuthUsers = async (pool, firebaseAuth) => {
  await ensureCustomerAuthTable(pool);

  let pageToken;
  const firebaseUsers = [];

  do {
    const page = await firebaseAuth.listUsers(1000, pageToken);
    firebaseUsers.push(...page.users);
    pageToken = page.pageToken;
  } while (pageToken);

  const firebaseUidSet = new Set(firebaseUsers.map((user) => user.uid));

  for (const user of firebaseUsers) {
    const provider = user.providerData?.[0]?.providerId || "password";
    await pool.query(
      `INSERT INTO customer_auth_users (
         firebase_uid, email, display_name, provider, is_disabled, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (firebase_uid)
       DO UPDATE SET
         email = EXCLUDED.email,
         display_name = EXCLUDED.display_name,
         provider = EXCLUDED.provider,
         is_disabled = EXCLUDED.is_disabled,
         updated_at = NOW()`,
      [user.uid, user.email || "", user.displayName || null, provider, !!user.disabled]
    );
  }

  const dbUsers = await pool.query("SELECT firebase_uid FROM customer_auth_users");
  const staleUids = dbUsers.rows
    .map((row) => row.firebase_uid)
    .filter((uid) => !firebaseUidSet.has(uid));

  if (staleUids.length > 0) {
    await pool.query("DELETE FROM customer_auth_users WHERE firebase_uid = ANY($1::text[])", [staleUids]);
  }
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

const ensureInventoryTable = async (pool) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inventory_items (
      id BIGSERIAL PRIMARY KEY,
      sku VARCHAR(100) NOT NULL UNIQUE,
      slug VARCHAR(200) NOT NULL UNIQUE,
      product_name VARCHAR(255) NOT NULL,
      short_description TEXT NOT NULL,
      long_description TEXT NOT NULL,
      color VARCHAR(100) NOT NULL,
      size VARCHAR(200) NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
      price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
      image_urls TEXT[] NOT NULL DEFAULT '{}',
      created_by_employee_id VARCHAR(50) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_inventory_items_created_by
    ON inventory_items (created_by_employee_id)
  `);
};

function slugifySkuPart(raw) {
  const s = String(raw || "item")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "item";
}

async function uniqueInventorySlug(pool, baseSlug) {
  let slug = baseSlug;
  let n = 0;
  for (;;) {
    const check = await pool.query("SELECT 1 FROM inventory_items WHERE slug = $1 LIMIT 1", [slug]);
    if (check.rowCount === 0) return slug;
    n += 1;
    slug = `${baseSlug}-${n}`;
  }
}

const mapInventoryItem = (row) => ({
  id: String(row.id),
  sku: row.sku,
  slug: row.slug,
  productName: row.product_name,
  shortDescription: row.short_description,
  longDescription: row.long_description,
  color: row.color,
  size: row.size,
  quantity: row.quantity,
  price: Number(row.price),
  imageUrls: row.image_urls || [],
  createdByEmployeeId: row.created_by_employee_id,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

const mapPublicProduct = (row) => ({
  id: String(row.id),
  slug: row.slug,
  name: row.product_name,
  shortDescription: row.short_description,
  description: row.long_description,
  price: Number(row.price),
  images: row.image_urls?.length ? row.image_urls : [],
  quantity: row.quantity,
  color: row.color,
  size: row.size,
  sku: row.sku,
});

const requireStaffToken = (context) => {
  if (!context?.token) {
    throw new GraphQLError("Unauthorized");
  }
  try {
    return verifyToken(context.token);
  } catch {
    throw new GraphQLError("Unauthorized");
  }
};

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
    await ensureStaffTableColumns(pool);
    if (!context?.token) return null;
    try {
      const decoded = verifyToken(context.token);
      const result = await pool.query(
        `SELECT id, employee_id, full_name, email, phone, department, role, is_disabled, created_at
         FROM staff_registrations
         WHERE id = $1`,
        [decoded.sub]
      );
      if (!result.rows[0]) return null;
      return mapStaff(result.rows[0]);
    } catch {
      return null;
    }
  },
  staffUsers: async () => {
    await ensureStaffTableColumns(pool);
    const result = await pool.query(
      `SELECT id, employee_id, full_name, email, phone, department, role, is_disabled, created_at
       FROM staff_registrations
       ORDER BY id DESC`
    );
    return result.rows.map(mapStaff);
  },
  customerAuthUsers: async () => {
    await ensureCustomerAuthTable(pool);
    const firebaseAuth = getFirebaseAuth();
    await reconcileCustomerAuthUsers(pool, firebaseAuth);
    const result = await pool.query(
      `SELECT id, firebase_uid, email, display_name, provider, is_disabled, created_at, updated_at
       FROM customer_auth_users
       ORDER BY id DESC`
    );
    return result.rows.map(mapCustomerAuthUser);
  },
  inventoryItems: async (_args, context) => {
    requireStaffToken(context);
    await ensureInventoryTable(pool);
    const result = await pool.query(
      `SELECT * FROM inventory_items ORDER BY created_at DESC, id DESC`
    );
    return result.rows.map(mapInventoryItem);
  },
  publicProducts: async () => {
    await ensureInventoryTable(pool);
    const result = await pool.query(`SELECT * FROM inventory_items ORDER BY id DESC`);
    return result.rows.map(mapPublicProduct);
  },
  publicProductBySlug: async ({ slug }) => {
    await ensureInventoryTable(pool);
    const result = await pool.query(`SELECT * FROM inventory_items WHERE slug = $1`, [slug]);
    if (!result.rows[0]) return null;
    return mapPublicProduct(result.rows[0]);
  },
  registerStaff: async ({ fullName, email, phone, department, role }) => {
    await ensureStaffTableColumns(pool);
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
        role,
        is_disabled
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, employee_id, full_name, email, phone, department, role, is_disabled, created_at
    `;

    const result = await pool.query(insertQuery, [
      employeeId,
      passwordHash,
      fullName,
      email,
      phone ?? null,
      department,
      role,
      false,
    ]);

    return {
      staff: mapStaff(result.rows[0]),
      tempPassword,
    };
  },
  loginStaff: async ({ employeeId, password }) => {
    await ensureStaffTableColumns(pool);
    const result = await pool.query(
      `SELECT id, employee_id, password_hash, full_name, email, phone, department, role, is_disabled, created_at
       FROM staff_registrations
       WHERE employee_id = $1`,
      [employeeId]
    );

    const staff = result.rows[0];
    if (!staff) {
      throw new GraphQLError("Invalid credentials");
    }
    if (staff.is_disabled) {
      throw new GraphQLError("Account is disabled");
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
  setStaffAccountDisabled: async ({ id, disabled }) => {
    await ensureStaffTableColumns(pool);
    const result = await pool.query(
      `UPDATE staff_registrations
       SET is_disabled = $2
       WHERE id = $1
       RETURNING id, employee_id, full_name, email, phone, department, role, is_disabled, created_at`,
      [id, disabled]
    );
    if (!result.rows[0]) {
      throw new GraphQLError("Staff user not found");
    }
    return mapStaff(result.rows[0]);
  },
  deleteStaffAccount: async ({ id }) => {
    const result = await pool.query("DELETE FROM staff_registrations WHERE id = $1", [id]);
    return (result.rowCount || 0) > 0;
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
  createInventoryItem: async (
    {
      sku,
      productName,
      shortDescription,
      longDescription,
      color,
      size,
      quantity,
      price,
      imageUrls,
    },
    context
  ) => {
    const decoded = requireStaffToken(context);
    await ensureInventoryTable(pool);
    const baseSlug = slugifySkuPart(sku);
    const slug = await uniqueInventorySlug(pool, baseSlug);
    try {
      const result = await pool.query(
        `INSERT INTO inventory_items (
          sku, slug, product_name, short_description, long_description,
          color, size, quantity, price, image_urls, created_by_employee_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
          sku.trim(),
          slug,
          productName,
          shortDescription,
          longDescription,
          color,
          size,
          quantity,
          price,
          imageUrls || [],
          decoded.employeeId,
        ]
      );
      return mapInventoryItem(result.rows[0]);
    } catch (e) {
      if (e.code === "23505") {
        throw new GraphQLError("SKU already exists");
      }
      throw e;
    }
  },
  updateInventoryItem: async (
    {
      id,
      sku,
      productName,
      shortDescription,
      longDescription,
      color,
      size,
      quantity,
      price,
      imageUrls,
    },
    context
  ) => {
    requireStaffToken(context);
    await ensureInventoryTable(pool);
    try {
      const result = await pool.query(
        `UPDATE inventory_items
         SET sku = $2,
             product_name = $3,
             short_description = $4,
             long_description = $5,
             color = $6,
             size = $7,
             quantity = $8,
             price = $9,
             image_urls = $10,
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [
          id,
          sku.trim(),
          productName,
          shortDescription,
          longDescription,
          color,
          size,
          quantity,
          price,
          imageUrls || [],
        ]
      );
      if (!result.rows[0]) {
        throw new GraphQLError("Inventory item not found");
      }
      return mapInventoryItem(result.rows[0]);
    } catch (e) {
      if (e.code === "23505") {
        throw new GraphQLError("SKU already exists");
      }
      throw e;
    }
  },
  deleteInventoryItem: async ({ id }, context) => {
    requireStaffToken(context);
    await ensureInventoryTable(pool);
    const result = await pool.query("DELETE FROM inventory_items WHERE id = $1", [id]);
    return (result.rowCount || 0) > 0;
  },
});

module.exports = { createResolvers };
