const analyticsService = require("../services/analyticsService");

const getDashboard = async (req, res) => {
  try {
    const results = await Promise.allSettled([
      analyticsService.getDashboardStats(),
      analyticsService.getTrendData(),
      analyticsService.getRecentActivity()
    ]);

    const stats = results[0].status === "fulfilled" ? results[0].value : { totalWorkshops: 0, totalStudents: 0, liveSessions: 0, completionRate: 0 };
    const trendData = results[1].status === "fulfilled" ? results[1].value : [];
    const recentActivity = results[2].status === "fulfilled" ? results[2].value : [];

    res.json({ ...stats, trendData, recentActivity });
  } catch (err) {
    console.error("Analytics error:", err);
    res.json({ totalWorkshops: 0, totalStudents: 0, liveSessions: 0, completionRate: 0, trendData: [], recentActivity: [] });
  }
};

module.exports = { getDashboard };
