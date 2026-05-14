console.log("🔥 SERVER FILE LOADED");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const Workshop = require("./models/Workshop");

const app = express();
const paymentUploadDir = path.join(__dirname, "uploads", "payments");

fs.mkdirSync(paymentUploadDir, { recursive: true });

const paymentStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, paymentUploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const paymentUpload = multer({
  storage: paymentStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error("Payment screenshot must be a JPG, PNG, or WEBP image."));
  }
});


const allowedOriginPattern = /^http:\/\/(?:localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}):5173$/;

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOriginPattern.test(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "25mb" }));

/* MongoDB connection */
mongoose.connect("mongodb://127.0.0.1:27017/skillnova")
  .then(() => console.log("✅ DB connected"))
  .catch(err => console.log(err));

/* Import model */
const Student = require("./models/Student");

const STAFF_USERS = [
  { username: "sagar", password: "sagar", role: "admin" },
  { username: "pranit", password: "pranit", role: "coworker" }
];
const AUTH_SECRET = process.env.AUTH_SECRET || "skillnova-local-dev-secret";

const signToken = (payload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
};

const verifyToken = (token) => {
  if (!token || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  const expectedSignature = crypto.createHmac("sha256", AUTH_SECRET).update(body).digest("base64url");
  if (signature.length !== expectedSignature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
};

const requireStaff = (allowedRoles = ["admin", "coworker"]) => (req, res, next) => {
  const authHeader = req.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  try {
    const user = verifyToken(token);
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(401).json({ message: "Authentication required" });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid authentication token" });
  }
};

app.use("/uploads/payments", requireStaff(["admin", "coworker"]), express.static(paymentUploadDir));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const findStudentsByWorkshop = (workshopId) => Student.find({
  $or: [
    { workshopId },
    { selectedWorkshopId: workshopId }
  ]
});

const normalizeWorkshopStatus = (workshop, registrationsCount) => {
  const status = String(workshop.status || "").toLowerCase();
  if (["closed", "completed"].includes(status)) return "Closed";

  const capacity = Number(workshop.capacity || workshop.seats || workshop.totalSeats);
  if (Number.isFinite(capacity) && capacity > 0 && registrationsCount >= capacity) return "Full";

  return "Open";
};

const toPublicWorkshopPayload = (workshop, registrationsCount) => {
  const capacity = Number(workshop.capacity || workshop.seats || workshop.totalSeats);
  const hasCapacity = Number.isFinite(capacity) && capacity > 0;

  return {
    _id: workshop._id,
    title: workshop.title,
    description: workshop.description,
    date: workshop.date,
    time: workshop.time,
    venue: workshop.location,
    instructor: workshop.instructor,
    coverImage: workshop.workshopImage,
    price: Number(workshop.price || 0),
    totalRegistrations: registrationsCount,
    seatsLeft: hasCapacity ? Math.max(capacity - registrationsCount, 0) : null,
    status: normalizeWorkshopStatus(workshop, registrationsCount)
  };
};

app.post("/auth/login", (req, res) => {
  const { username, email, password } = req.body;
  const loginId = username || email;
  const user = STAFF_USERS.find(u => u.username === loginId && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const authUser = { username: user.username, role: user.role };
  const token = signToken({
    ...authUser,
    exp: Date.now() + 1000 * 60 * 60 * 12
  });

  res.json({ user: authUser, token });
});

/* POST API */
app.post("/register", paymentUpload.single("paymentScreenshot"), async (req, res) => {
  try {
    const {
      name,
      college,
      phone,
      email,
      upiId,
      utrId,
      workshopId,
      selectedWorkshopId
    } = req.body;

    const finalWorkshopId = selectedWorkshopId || workshopId;
    if (!finalWorkshopId) {
      return res.status(400).send("Please select a workshop.");
    }

    const workshop = await Workshop.findById(finalWorkshopId);
    if (!workshop) {
      return res.status(404).send("Selected workshop not found.");
    }

    const paymentAmount = Number(workshop.price || 0);
    const finalUtrId = utrId || upiId || "";
    const paymentScreenshot = req.file ? `/uploads/payments/${req.file.filename}` : "";

    if (paymentAmount > 0 && !finalUtrId.trim()) {
      return res.status(400).send("UPI Transaction ID is required for paid workshops.");
    }

    if (paymentAmount > 0 && !paymentScreenshot) {
      return res.status(400).send("Payment screenshot is required for paid workshops.");
    }

    const student = new Student({
    name,
    college,
    phone,
    email,
    upiId,       // ✅ ADD THIS
    workshopId,
      upiId: finalUtrId,
      utrId: finalUtrId,
      workshopId: finalWorkshopId,
      selectedWorkshopId: finalWorkshopId,
      selectedWorkshopTitle: workshop.title,
      paymentAmount,
      paymentScreenshot,
      paymentStatus: paymentAmount > 0 ? "pending" : "free"
  });

    await student.save();

    res.send("Student registered successfully");
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).send(err.message || "Error registering student");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Student.findOne({ email });

    if (!user) {
      return res.send("User not found");
    }

    // ⚠️ TEMPORARY password check (we didn’t store password yet)
    if (password !== "1234") {
      return res.send("Wrong password");
    }

    res.send("Login successful");
  } catch (err) {
    res.status(500).send("Error logging in");
  }
});

console.log("✅ WORKSHOPS ROUTE REGISTERED");

app.post("/workshops", async (req, res) => {
  try {
    const price = Number(req.body.price);
    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ message: "Workshop price must be 0 or more" });
    }

    const workshop = new Workshop({ ...req.body, price });
    const createdWorkshop = await workshop.save();
    res.status(201).json(createdWorkshop);
  } catch (err) {
    console.error("CREATE WORKSHOP ERROR:", err);
    res.status(500).json({
      message: "Error creating workshop",
      error: err.message
    });
  }
});

/* ✅ ADD HERE (GET API) */
app.get("/students", requireStaff(["admin", "coworker"]), async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).send("Error fetching students");
  }
});

app.get("/workshops", async (req, res) => {
  console.log("🔥 workshops route hit");   // 👈 ADD THIS LINE

  try {
    const data = await Workshop.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).send("Error fetching workshops");
  }
});

app.get("/workshops/:id/public", async (req, res) => {
  console.log(`🔥 Public workshop route hit for ID: ${req.params.id}`);
  try {
    const workshop = await Workshop.findById(req.params.id).lean();
    if (!workshop) {
      return res.status(404).send("Workshop not found");
    }

    const totalRegistrations = await Student.countDocuments({
      $or: [
        { workshopId: req.params.id },
        { selectedWorkshopId: req.params.id }
      ]
    });

    res.json(toPublicWorkshopPayload(workshop, totalRegistrations));
  } catch (err) {
    console.error(`❌ Error fetching public workshop ${req.params.id}:`, err);
    res.status(500).send("Error fetching public workshop");
  }
});

app.get("/workshops/:id/admin", requireStaff(["admin", "coworker"]), async (req, res) => {
  try {
    const workshopDetails = await Workshop.findById(req.params.id);
    if (!workshopDetails) {
      return res.status(404).send("Workshop not found");
    }

    const registeredStudents = await findStudentsByWorkshop(req.params.id).sort({ _id: -1 });
    const paymentInfo = registeredStudents.map(student => ({
      studentId: student._id,
      name: student.name,
      paymentAmount: student.paymentAmount,
      paymentScreenshot: student.paymentScreenshot,
      paymentStatus: student.paymentStatus,
      utrId: student.utrId || student.upiId
    }));

    res.json({ workshopDetails, registeredStudents, paymentInfo });
  } catch (err) {
    res.status(500).send("Error fetching internal workshop");
  }
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

// ✅ GET single workshop by id
app.get("/workshops/:id", async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).send("Workshop not found");
    }
    res.json(workshop);
  } catch (err) {
    res.status(500).send("Error fetching workshop");
  }
});

// ✅ GET students by workshop
app.get("/workshops/:id/students", requireStaff(["admin", "coworker"]), async (req, res) => {
  try {
    const students = await findStudentsByWorkshop(req.params.id);
    res.json(students);
  } catch (err) {
    res.status(500).send("Error fetching students");
  }
});

app.get("/students/:workshopId", requireStaff(["admin", "coworker"]), async (req, res) => {
  try {
    const students = await findStudentsByWorkshop(req.params.workshopId);

    res.json(students);
  } catch (err) {
    res.status(500).send("Error fetching students");
  }
});

// ✅ GET single student by id
app.get("/student/:id", requireStaff(["admin", "coworker"]), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).send("Student not found");
    }

    res.json(student);
  } catch (err) {
    res.status(500).send("Error fetching student");
  }
});

// ✅ PUT update single student
app.put("/student/:id", requireStaff(["admin"]), async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).send("Student not found");
    }

    res.json(updated);
  } catch (err) {
    res.status(500).send("Error updating student");
  }
});

app.delete("/workshops/:id", async (req, res) => {
  try {
    const deleted = await Workshop.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).send("Workshop not found");
    }

    res.send("Deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting");
  }
});

// ✅ DELETE single student (remove from workshop)
app.delete("/student/:id", requireStaff(["admin"]), async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).send("Student not found");
    }
    res.send("Student removed successfully");
  } catch (err) {
    res.status(500).send("Error removing student");
  }
});

// 👉 ADD THIS BELOW DELETE ROUTE
app.put("/workshops/:id", async (req, res) => {
  try {
    const updatePayload = { ...req.body };
    if (Object.prototype.hasOwnProperty.call(updatePayload, "price")) {
      const price = Number(updatePayload.price);
      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).send("Workshop price must be 0 or more");
      }
      updatePayload.price = price;
    }

    const updated = await Workshop.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true }
    );

    if (!updated) {
      return res.status(404).send("Workshop not found");
    }

    res.json(updated);
  } catch (err) {
    res.status(500).send("Error updating workshop");
  }
});

// ===============================
// GET SINGLE STUDENT
// ===============================
app.get("/student/:id", requireStaff(["admin", "coworker"]), async (req, res) => {
  console.log("HIT /student/:id", req.params.id); // 👈 debug

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).send("Student not found");
    }

    res.json(student);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching student");
  }
});

/* Start server */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
