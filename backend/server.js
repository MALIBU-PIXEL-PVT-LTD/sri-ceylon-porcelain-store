const express = require("express");
const cors = require("cors");
const { createHandler } = require("graphql-http/lib/use/express");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const { createGraphQLConfig } = require("./graphql");

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 7300;
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://portal.sriceylonporcelain.com",
  "https://sriceylonporcelain.com",
  "https://www.sriceylonporcelain.com",
];
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "postgres",
});
const graphqlConfig = createGraphQLConfig(pool);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(
  "/graphql",
  createHandler(graphqlConfig)
);

app.listen(port, async () => {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error.message);
  }
  console.log(`GraphQL server running on http://localhost:${port}/graphql`);
});
