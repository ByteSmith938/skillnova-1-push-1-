const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const studentController = require("../controllers/studentController");
const { requireStaff }  = require("../middleware/authMiddleware");
const { paymentUpload } = require("../config/cloudinary");

// ── Multer error wrapper ──────────────────────────────────────────────────────
// Wraps a multer middleware so that upload errors (wrong type, size limit,
// Cloudinary auth failures) are caught and returned as 400/500 responses
// instead of crashing Express with an unhandled exception.
const withUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (!err) return next();

    // Multer-specific errors (file type, size limit)
    if (err instanceof multer.MulterError) {
      console.error("[upload] MulterError:", err.code, err.message);
      return res.status(400).send(`Upload error: ${err.message}`);
    }

    // Cloudinary / custom fileFilter errors
    console.error("[upload] upload middleware error:", err.message || err);
    return res.status(500).send(
      typeof err === "string" ? err : (err.message || "File upload failed")
    );
  });
};

// ── Public registration ───────────────────────────────────────────────────────
router.post(
  "/register",
  withUpload(paymentUpload.single("paymentScreenshot")),
  studentController.registerStudent
);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get("/students",              requireStaff(),          studentController.getAllStudents);
router.get("/workshop/:workshopId",  requireStaff(),          studentController.getStudentsByWorkshop);
router.get("/student/:id",           requireStaff(["admin"]), studentController.getStudentById);
router.put("/student/:id",           requireStaff(["admin"]), studentController.updateStudent);
router.patch("/student/:id/payment-status", requireStaff(),  studentController.updatePaymentStatus);
router.delete("/student/:id",        requireStaff(["admin"]), studentController.deleteStudent);

module.exports = router;
