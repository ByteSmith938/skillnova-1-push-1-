require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Initialize express
const app = express();

// Connect to Database
connectDB();

// Middleware
const allowedOriginPattern = /^http:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}):5173$/;

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOriginPattern.test(origin) || origin === process.env.FRONTEND_URL) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  }
}));

app.use(express.json({ limit: "25mb" }));

// Routes
app.use("/admin", require("./routes/authRoutes"));
app.use("/workshops", require("./routes/workshopRoutes"));
app.use("/", require("./routes/studentRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

// Root route for health check
app.get("/", (req, res) => {
  res.send("SkillNova API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
// Bind to 0.0.0.0 so the server is reachable on all network interfaces
// (localhost, 127.0.0.1, and LAN IPs like 192.168.x.x)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT} (all interfaces)`);
});
