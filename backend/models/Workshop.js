const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  location: String,
  instructor: String,
  description: String,
  price: { type: Number, required: true, min: 0, default: 0 },
  workshopImage: String,
  status: String,
  capacity: Number
});

module.exports = mongoose.model("Workshop", workshopSchema);
