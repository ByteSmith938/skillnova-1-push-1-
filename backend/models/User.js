const mongoose = require("mongoose");

/**
 * Persistent profile for staff users (admin / coworker).
 * The username field matches the hardcoded STAFF_USERS in authController.
 */
const userSchema = new mongoose.Schema(
  {
    username:  { type: String, required: true, unique: true, lowercase: true, trim: true },
    role:      { type: String, enum: ["admin", "coworker"], required: true },
    fullName:  { type: String, default: "" },
    email:     { type: String, default: "" },
    phone:     { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
