const ChatMessage = require("../models/ChatMessage");
const ChatChannel = require("../models/ChatChannel");

const DEFAULT_CHANNELS = [
  { name: "general-updates",  label: "General Updates",  description: "Platform-wide updates and team communication", icon: "Hash" },
  { name: "workshop-issues",  label: "Workshop Issues",   description: "Manage workshop-related problems and escalations", icon: "BookOpen" },
  { name: "student-support",  label: "Student Support",   description: "Student issues, complaints and escalations", icon: "Users" },
  { name: "announcements",    label: "Announcements",     description: "Official announcements from the admin team", icon: "Megaphone" },
];

const seedChannels = async () => {
  for (const ch of DEFAULT_CHANNELS) {
    const exists = await ChatChannel.findOne({ name: ch.name });
    if (!exists) {
      await ChatChannel.create({ ...ch, createdBy: "system", members: [] });
    }
  }
};

const getChannels = async () => {
  await seedChannels();
  return ChatChannel.find().sort({ createdAt: 1 }).lean();
};

const getMessages = async (channelId, limit = 100) => {
  return ChatMessage.find({ channelId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

const saveMessage = async ({ senderId, senderName, senderRole, channelId, message }) => {
  const msg = await ChatMessage.create({
    senderId, senderName, senderRole, channelId, message
  });
  return msg.toObject();
};

const getOnlineUsers = (currentUsername) => {
  const allStaff = [
    { username: "sagar", role: "admin" },
    { username: "pranit", role: "coworker" },
  ];
  return allStaff.map(u => ({
    username: u.username,
    role: u.role,
    status: u.username === currentUsername ? "online" : "away",
    initials: u.username.charAt(0).toUpperCase() + u.username.slice(1, 2).toUpperCase(),
    avatarColor: u.username === "sagar"
      ? "linear-gradient(135deg,#00d2ff,#7000ff)"
      : "linear-gradient(135deg,#8b5cf6,#ec4899)"
  }));
};

const getActivityFeed = async () => {
  const activities = [];

  try {
    const recentMessages = await ChatMessage.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    for (const m of recentMessages) {
      activities.push({
        id: `msg-${m._id}`,
        text: `${m.senderName} sent a message in ${m.channelId}`,
        time: m.createdAt.toISOString(),
        color: "#00d2ff"
      });
    }

    const Workshop = require("../models/Workshop");
    const recentWorkshops = await Workshop.find()
      .sort({ _id: -1 })
      .limit(3)
      .select("title")
      .lean();

    for (const w of recentWorkshops) {
      activities.push({
        id: `ws-${w._id}`,
        text: `Workshop "${w.title}" created`,
        time: w._id.getTimestamp().toISOString(),
        color: "#f59e0b"
      });
    }

    const Student = require("../models/Student");
    const recentStudents = await Student.find()
      .sort({ _id: -1 })
      .limit(3)
      .select("name paymentStatus")
      .lean();

    for (const s of recentStudents) {
      if (s.paymentStatus === "verified" || s.paymentStatus === "completed") {
        activities.push({
          id: `stu-${s._id}`,
          text: `Student "${s.name}" payment approved`,
          time: s._id.getTimestamp().toISOString(),
          color: "#10b981"
        });
      }
    }

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    return activities.slice(0, 10);
  } catch (err) {
    return activities;
  }
};

module.exports = { getChannels, getMessages, saveMessage, getOnlineUsers, getActivityFeed };
