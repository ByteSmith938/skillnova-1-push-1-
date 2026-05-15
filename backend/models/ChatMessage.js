const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, required: true },
  channelId: { type: String, required: true, index: true },
  message: { type: String, required: true },
  edited: { type: Boolean, default: false },
  readBy: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
