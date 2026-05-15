const { signToken } = require("../utils/authUtils");

const STAFF_USERS = [
  { username: "sagar", password: "sagar", role: "admin" },
  { username: "pranit", password: "pranit", role: "coworker" }
];

const login = (req, res) => {
  const { username, password } = req.body;
  const user = STAFF_USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ 
    username: user.username, 
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });

  res.json({ token, role: user.role, username: user.username });
};

module.exports = { login };
