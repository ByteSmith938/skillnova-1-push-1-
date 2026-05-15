const mongoose = require("mongoose");

const chatChannelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  description: { type: String, default: "" },
  icon: { type: String, default: "Hash" },
  createdBy: { type: String, required: true },
  members: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("ChatChannel", chatChannelSchema);
