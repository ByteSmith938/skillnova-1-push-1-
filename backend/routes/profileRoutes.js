const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { requireStaff } = require("../middleware/authMiddleware");
const { avatarUpload } = require("../config/cloudinary");

// All profile routes require authenticated staff
router.get("/me",     requireStaff(), profileController.getProfile);
router.put("/update", requireStaff(), profileController.updateProfile);

router.post(
  "/avatar",
  requireStaff(),
  avatarUpload.single("avatar"),
  profileController.uploadAvatar
);

router.delete("/avatar", requireStaff(), profileController.removeAvatar);

module.exports = router;
