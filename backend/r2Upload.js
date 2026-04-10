const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");
const path = require("path");

function getR2Client() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("R2_ENDPOINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY must be set");
  }
  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
}

/**
 * @param {Buffer} buffer
 * @param {string} originalName
 * @param {string} [contentType]
 * @returns {Promise<string>} Public URL
 */
async function uploadInventoryImageBuffer(buffer, originalName, contentType) {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error("R2_BUCKET_NAME is required");
  }
  const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!publicBase) {
    throw new Error("R2_PUBLIC_URL must be set (public bucket URL or custom domain)");
  }

  const ext = path.extname(originalName || "") || ".jpg";
  const safeExt = ext.match(/^\.[a-z0-9]+$/i) ? ext : ".jpg";
  const key = `inventory/${randomUUID()}${safeExt}`;

  const client = getR2Client();
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType || "application/octet-stream",
      })
    );
  } catch (err) {
    const code = err?.Code || err?.name;
    const msg = err?.message || "";
    if (
      code === "AccessDenied" ||
      /access denied/i.test(msg) ||
      err?.$metadata?.httpStatusCode === 403
    ) {
      const hint =
        `R2 upload was denied (403). Check Cloudflare R2: (1) R2_BUCKET_NAME "${bucket}" matches the bucket exactly. ` +
        `(2) The S3 Access Key ID + Secret were created for an API token with **Object Read & Write** (or Admin) on that bucket. ` +
        `(3) R2_ENDPOINT matches the account that owns the bucket.`;
      const wrapped = new Error(`${msg.trim() || "Access Denied"}. ${hint}`);
      wrapped.cause = err;
      throw wrapped;
    }
    throw err;
  }

  return `${publicBase}/${key}`;
}

module.exports = { uploadInventoryImageBuffer };
