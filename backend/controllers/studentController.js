const Student  = require("../models/Student");
const { CLOUDINARY_ENABLED } = require("../config/cloudinary");

// ─────────────────────────────────────────────────────────────────────────────
// POST /register  (public)
// ─────────────────────────────────────────────────────────────────────────────
const registerStudent = async (req, res) => {
  try {
    console.log("[register] body keys :", Object.keys(req.body));
    console.log("[register] file      :", req.file
      ? `${req.file.originalname} (${req.file.size} bytes, cloudinary=${CLOUDINARY_ENABLED})`
      : "none");

    const {
      name,
      college,
      phone,
      email,
      selectedWorkshopId,
      selectedWorkshopTitle = "",
      utrId = "",
      upiId = "",
    } = req.body;

    // ── Validation ────────────────────────────────────────────────────────────
    const missing = [];
    if (!name?.trim())               missing.push("name");
    if (!college?.trim())            missing.push("college");
    if (!phone?.trim())              missing.push("phone");
    if (!email?.trim())              missing.push("email");
    if (!selectedWorkshopId?.trim()) missing.push("selectedWorkshopId");

    if (missing.length) {
      return res.status(400).send(`Missing required fields: ${missing.join(", ")}`);
    }

    // ── Screenshot URL ────────────────────────────────────────────────────────
    // When Cloudinary is enabled  → req.file.path  is the secure Cloudinary URL
    // When using memoryStorage    → no persistent URL; store a placeholder note
    let screenshotUrl = null;
    if (req.file) {
      if (CLOUDINARY_ENABLED && req.file.path) {
        screenshotUrl = req.file.path;
      } else {
        // Memory storage — file received but not persisted to cloud.
        // Store a marker so the admin knows a screenshot was uploaded.
        screenshotUrl = `[uploaded:${req.file.originalname}]`;
        console.warn("[register] Screenshot received but Cloudinary not configured — not persisted.");
      }
    }

    // ── Determine payment status ──────────────────────────────────────────────
    const hasPaymentProof = !!(utrId?.trim() || upiId?.trim());
    const paymentStatus   = hasPaymentProof ? "pending" : "free";

    // ── Save student ──────────────────────────────────────────────────────────
    const student = new Student({
      name:                 name.trim(),
      college:              college.trim(),
      phone:                phone.trim(),
      email:                email.trim(),
      selectedWorkshopId:   selectedWorkshopId.trim(),
      selectedWorkshopTitle: selectedWorkshopTitle.trim(),
      workshopId:           selectedWorkshopId.trim(), // keep legacy field in sync
      utrId:                utrId.trim(),
      upiId:                upiId.trim(),
      paymentScreenshot:    screenshotUrl,
      paymentStatus,
    });

    await student.save();
    console.log("[register] ✅ saved student:", student._id.toString(), "| status:", paymentStatus);

    res.status(201).send("Registration successful!");
  } catch (err) {
    console.error("[register] ❌ error:", err.message || err);
    res.status(500).send(err.message || "Error registering student");
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /students  (admin)
// ─────────────────────────────────────────────────────────────────────────────
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ _id: -1 });
    res.json(students);
  } catch (err) {
    console.error("[getAllStudents] error:", err.message);
    res.status(500).json({ message: "Error fetching students" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /workshop/:workshopId  (admin)
// ─────────────────────────────────────────────────────────────────────────────
const getStudentsByWorkshop = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const students = await Student.find({
      $or: [
        { workshopId },
        { selectedWorkshopId: workshopId },
      ],
    }).sort({ _id: -1 });
    res.json(students);
  } catch (err) {
    console.error("[getStudentsByWorkshop] error:", err.message);
    res.status(500).json({ message: "Error fetching students" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /student/:id  (admin)
// ─────────────────────────────────────────────────────────────────────────────
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("[getStudentById] error:", err.message);
    res.status(500).json({ message: "Error fetching student" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /student/:id  (admin)
// ─────────────────────────────────────────────────────────────────────────────
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("[updateStudent] error:", err.message);
    res.status(400).json({ message: err.message || "Error updating student" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /student/:id/payment-status  (admin)
// ─────────────────────────────────────────────────────────────────────────────
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const allowed = ["free", "pending", "verified", "completed", "rejected"];
    if (!allowed.includes(paymentStatus)) {
      return res.status(400).json({ message: `Invalid paymentStatus: ${paymentStatus}` });
    }
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("[updatePaymentStatus] error:", err.message);
    res.status(400).json({ message: err.message || "Error updating payment status" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /student/:id  (admin)
// ─────────────────────────────────────────────────────────────────────────────
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error("[deleteStudent] error:", err.message);
    res.status(500).json({ message: "Error deleting student" });
  }
};

module.exports = {
  registerStudent,
  getAllStudents,
  getStudentsByWorkshop,
  getStudentById,
  updateStudent,
  updatePaymentStatus,
  deleteStudent,
};
