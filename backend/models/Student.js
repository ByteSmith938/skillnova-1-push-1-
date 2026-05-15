const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  college: String,
  phone: String,
  email: String,
  workshopId: String,
  upiId: String,
  selectedWorkshopId: String,
  selectedWorkshopTitle: String,
  paymentAmount: { type: Number, default: 0 },
  paymentScreenshot: String,
  paymentStatus: {
    type: String,
    enum: ["free", "pending", "verified", "completed", "rejected"],
    default: "free"
  },
  utrId: String,
  attendance: { type: Number, default: 0 },
  completionStatus: { type: String, default: 'Pending' },
  notes: String,
});

module.exports = mongoose.model("Student", studentSchema);
