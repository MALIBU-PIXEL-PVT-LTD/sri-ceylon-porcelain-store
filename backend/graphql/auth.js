const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "change-this-jwt-secret";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "8h";

const signToken = (staff) =>
  jwt.sign(
    {
      sub: String(staff.id),
      employeeId: staff.employee_id,
      role: staff.role,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

const readBearerToken = (headers) => {
  const authHeader = headers?.authorization || headers?.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length).trim();
};

const verifyToken = (token) => jwt.verify(token, jwtSecret);

module.exports = {
  signToken,
  readBearerToken,
  verifyToken,
};
