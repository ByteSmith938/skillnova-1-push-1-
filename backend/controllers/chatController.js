const chatService = require("../services/chatService");

const getChannels = async (req, res) => {
  try {
    const channels = await chatService.getChannels();
    res.json(channels);
  } catch (err) {
    console.error("Error fetching channels:", err);
    res.status(500).json({ message: "Error fetching channels" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await chatService.getMessages(channelId);
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { channelId, message } = req.body;
    if (!channelId || !message || !message.trim()) {
      return res.status(400).json({ message: "channelId and message are required" });
    }

    const msg = await chatService.saveMessage({
      senderId: req.user.username,
      senderName: req.user.username,
      senderRole: req.user.role,
      channelId,
      message: message.trim(),
    });

    res.status(201).json(msg);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Error sending message" });
  }
};

const getOnlineUsers = async (req, res) => {
  try {
    // getOnlineUsers is synchronous — no await needed
    const users = chatService.getOnlineUsers(req.user.username);
    res.json(users);
  } catch (err) {
    console.error("Error fetching online users:", err);
    res.status(500).json({ message: "Error fetching online users" });
  }
};

const getActivity = async (req, res) => {
  try {
    const activity = await chatService.getActivityFeed();
    res.json(activity);
  } catch (err) {
    console.error("Error fetching activity:", err);
    res.status(500).json({ message: "Error fetching activity" });
  }
};

module.exports = { getChannels, getMessages, sendMessage, getOnlineUsers, getActivity };
