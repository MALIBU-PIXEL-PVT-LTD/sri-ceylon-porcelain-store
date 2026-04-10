const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { createHandler } = require("graphql-http/lib/use/express");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const { createGraphQLConfig } = require("./graphql");
const { readBearerToken, verifyToken } = require("./graphql/auth");
const { uploadInventoryImageBuffer } = require("./r2Upload");

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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 10, fileSize: 12 * 1024 * 1024 },
});

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

app.post(
  "/inventory/upload-images",
  upload.array("images", 10),
  async (req, res) => {
    try {
      const token = readBearerToken(req.headers);
      if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      verifyToken(token);
      const files = req.files || [];
      if (!files.length) {
        res.status(400).json({ error: "No images uploaded" });
        return;
      }
      const urls = [];
      for (const file of files) {
        urls.push(
          await uploadInventoryImageBuffer(file.buffer, file.originalname, file.mimetype)
        );
      }
      res.json({ urls });
    } catch (error) {
      console.error("R2 upload error:", error);
      if (error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError") {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const message = error?.message || "Upload failed";
      res.status(500).json({ error: message });
    }
  }
);

app.use(express.json({ limit: "2mb" }));
app.use("/graphql", createHandler(graphqlConfig));

app.listen(port, async () => {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error.message);
  }
  console.log(`GraphQL server running on http://localhost:${port}/graphql`);
});
