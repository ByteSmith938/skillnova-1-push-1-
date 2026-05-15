const Workshop = require("../models/Workshop");
const Student = require("../models/Student");
const mongoose = require("mongoose");

const getDashboardStats = async () => {
  try {
    const totalWorkshops = await Workshop.countDocuments();
    const totalStudents = await Student.countDocuments();

    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const allWorkshops = await Workshop.find({}, "date").lean();
    const liveSessions = allWorkshops.filter(w => {
      const d = new Date(w.date);
      return !isNaN(d.getTime()) && d >= now && d <= in24h;
    }).length;

    const completedStudents = await Student.countDocuments({
      paymentStatus: { $in: ["verified", "completed"] }
    });
    const completionRate = totalStudents > 0
      ? Math.round((completedStudents / totalStudents) * 100)
      : 0;

    return { totalWorkshops, totalStudents, liveSessions, completionRate };
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return { totalWorkshops: 0, totalStudents: 0, liveSessions: 0, completionRate: 0 };
  }
};

const getTrendData = async () => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const emptyTrend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    emptyTrend.push({ name: dayNames[d.getDay()], attendance: 0 });
  }

  try {
    const sevenDaysAgoSeconds = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
    const minOid = mongoose.Types.ObjectId.createFromTime(sevenDaysAgoSeconds);

    const results = await Student.aggregate([
      {
        $match: {
          _id: { $gte: minOid }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$_id" } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const trendMap = {};
    for (const r of results) {
      trendMap[r._id] = r.count;
    }

    return emptyTrend.map((item, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().split("T")[0];
      return { ...item, attendance: trendMap[key] || 0 };
    });
  } catch (err) {
    return emptyTrend;
  }
};

const getRecentActivity = async () => {
  const activities = [];

  try {
    const [recentWorkshops, recentStudents] = await Promise.all([
      Workshop.find().sort({ _id: -1 }).limit(5).select("title").lean(),
      Student.find().sort({ _id: -1 }).limit(5).select("name paymentStatus").lean()
    ]);

    for (const w of recentWorkshops) {
      activities.push({
        id: `ws-${w._id}`,
        text: `Workshop "${w.title}" created`,
        time: w._id.getTimestamp().toISOString(),
        type: "workshop_created",
        color: "#00D2FF"
      });
    }

    for (const s of recentStudents) {
      let text, color;
      if (s.paymentStatus === "verified" || s.paymentStatus === "completed") {
        text = `Student "${s.name}" payment approved`;
        color = "#10b981";
      } else if (s.paymentStatus === "rejected") {
        text = `Student "${s.name}" payment rejected`;
        color = "#ef4444";
      } else {
        text = `Student "${s.name}" registered`;
        color = "#7000FF";
      }
      activities.push({
        id: `stu-${s._id}`,
        text,
        time: s._id.getTimestamp().toISOString(),
        type: "student_registered",
        color
      });
    }

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    return activities.slice(0, 6);
  } catch (err) {
    return activities;
  }
};

module.exports = { getDashboardStats, getTrendData, getRecentActivity };
