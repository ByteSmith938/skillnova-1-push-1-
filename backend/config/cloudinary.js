const multer = require("multer");

// ── Cloudinary is optional ────────────────────────────────────────────────────
// If credentials are missing (local dev without .env), we fall back to
// in-memory storage so registration still works — screenshots just won't be
// persisted to the cloud.  Set all three env vars to enable Cloudinary.
const CLOUDINARY_ENABLED =
  !!(process.env.CLOUDINARY_CLOUD_NAME &&
     process.env.CLOUDINARY_API_KEY    &&
     process.env.CLOUDINARY_API_SECRET);

let cloudinary = null;

// ── Payment upload middleware ─────────────────────────────────────────────────
let paymentUpload;

if (CLOUDINARY_ENABLED) {
  const cloudinaryLib = require("cloudinary").v2;
  const { CloudinaryStorage } = require("multer-storage-cloudinary");

  cloudinaryLib.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  cloudinary = cloudinaryLib;

  const paymentStorage = new CloudinaryStorage({
    cloudinary: cloudinaryLib,
    params: {
      folder:          "skillnova/payments",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation:  [{ width: 1000, height: 1000, crop: "limit" }],
    },
  });

  paymentUpload = multer({
    storage: paymentStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  });

  console.log("☁️  Cloudinary storage enabled for payment screenshots");
} else {
  // Fallback: keep file in memory (req.file.buffer available, req.file.path = undefined)
  paymentUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only jpg, png, jpeg, webp images are allowed"));
      }
    },
  });

  console.warn(
    "⚠️  Cloudinary credentials not set — payment screenshots stored in memory only.\n" +
    "   Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env to enable cloud storage."
  );
}

// ── Avatar upload middleware ──────────────────────────────────────────────────
let avatarUpload;

if (CLOUDINARY_ENABLED) {
  const cloudinaryLib = cloudinary; // already configured above
  const { CloudinaryStorage } = require("multer-storage-cloudinary");

  const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinaryLib,
    params: {
      folder:          "skillnova/avatars",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation:  [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
    },
  });

  avatarUpload = multer({
    storage: avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only jpg, png, jpeg, webp images are allowed"));
      }
    },
  });
} else {
  avatarUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only jpg, png, jpeg, webp images are allowed"));
      }
    },
  });
}

module.exports = { cloudinary, paymentUpload, avatarUpload, CLOUDINARY_ENABLED };
