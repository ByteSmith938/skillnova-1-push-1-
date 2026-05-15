const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const { requireStaff } = require("../middleware/authMiddleware");

router.get("/dashboard", requireStaff(), analyticsController.getDashboard);

module.exports = router;
