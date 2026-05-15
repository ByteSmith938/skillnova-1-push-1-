const express = require("express");
const router = express.Router();
const workshopController = require("../controllers/workshopController");
const { requireStaff } = require("../middleware/authMiddleware");

// Public routes
router.get("/public", workshopController.getPublicWorkshops);
router.get("/:id", workshopController.getWorkshopById);

// Admin routes
router.post("/", requireStaff(["admin"]), workshopController.createWorkshop);
router.put("/:id", requireStaff(["admin"]), workshopController.updateWorkshop);
router.delete("/:id", requireStaff(["admin"]), workshopController.deleteWorkshop);

module.exports = router;
