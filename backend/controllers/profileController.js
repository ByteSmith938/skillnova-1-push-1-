const User = require("../models/User");

/**
 * Ensure a User document exists for the authenticated staff member.
 * Called internally — creates the record on first access.
 */
const ensureProfile = async (username, role) => {
  let profile = await User.findOne({ username });
  if (!profile) {
    profile = await User.create({
      username,
      role,
      fullName: username.charAt(0).toUpperCase() + username.slice(1),
    });
  }
  return profile;
};

// GET /api/profile/me
const getProfile = async (req, res) => {
  try {
    const profile = await ensureProfile(req.user.username, req.user.role);

    // Update lastLogin on every fetch (acts as "last seen")
    profile.lastLogin = new Date();
    await profile.save();

    res.json({
      username:  profile.username,
      role:      profile.role,
      fullName:  profile.fullName,
      email:     profile.email,
      phone:     profile.phone,
      avatarUrl: profile.avatarUrl,
      lastLogin: profile.lastLogin,
      createdAt: profile.createdAt,
    });
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// PUT /api/profile/update
const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    const profile = await ensureProfile(req.user.username, req.user.role);

    if (fullName !== undefined) profile.fullName = fullName.trim();
    if (email    !== undefined) profile.email    = email.trim();
    if (phone    !== undefined) profile.phone    = phone.trim();

    await profile.save();

    res.json({
      username:  profile.username,
      role:      profile.role,
      fullName:  profile.fullName,
      email:     profile.email,
      phone:     profile.phone,
      avatarUrl: profile.avatarUrl,
      lastLogin: profile.lastLogin,
      createdAt: profile.createdAt,
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// POST /api/profile/avatar  (multipart/form-data, field: "avatar")
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const profile = await ensureProfile(req.user.username, req.user.role);
    profile.avatarUrl = req.file.path; // Cloudinary secure URL
    await profile.save();

    res.json({ avatarUrl: profile.avatarUrl });
  } catch (err) {
    console.error("uploadAvatar error:", err);
    res.status(500).json({ message: "Error uploading avatar" });
  }
};

// DELETE /api/profile/avatar
const removeAvatar = async (req, res) => {
  try {
    const profile = await ensureProfile(req.user.username, req.user.role);
    profile.avatarUrl = "";
    await profile.save();
    res.json({ avatarUrl: "" });
  } catch (err) {
    console.error("removeAvatar error:", err);
    res.status(500).json({ message: "Error removing avatar" });
  }
};

module.exports = { getProfile, updateProfile, uploadAvatar, removeAvatar };
