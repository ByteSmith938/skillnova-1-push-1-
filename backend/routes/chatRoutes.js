const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { requireStaff } = require("../middleware/authMiddleware");

router.get("/channels", requireStaff(), chatController.getChannels);
router.get("/messages/:channelId", requireStaff(), chatController.getMessages);
router.post("/message", requireStaff(), chatController.sendMessage);
router.get("/online-users", requireStaff(), chatController.getOnlineUsers);
router.get("/activity", requireStaff(), chatController.getActivity);

module.exports = router;
