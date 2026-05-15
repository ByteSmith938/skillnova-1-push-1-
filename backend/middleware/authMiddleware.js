const { verifyToken } = require("../utils/authUtils");

const requireStaff = (allowedRoles = ["admin", "coworker"]) => (req, res, next) => {
  const authHeader = req.get("authorization") || "";
  let token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  // Support token in query string for window.open/new tab access (like payment screenshots)
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    const user = verifyToken(token);
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { requireStaff };
