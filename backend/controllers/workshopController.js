const Workshop = require("../models/Workshop");

const getPublicWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find();
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ message: "Error fetching workshops" });
  }
};

const getWorkshopById = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ message: "Workshop not found" });
    res.json(workshop);
  } catch (err) {
    res.status(500).json({ message: "Error fetching workshop" });
  }
};

const createWorkshop = async (req, res) => {
  try {
    const workshop = new Workshop(req.body);
    await workshop.save();
    res.status(201).json(workshop);
  } catch (err) {
    res.status(400).json({ message: "Error creating workshop" });
  }
};

const updateWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(workshop);
  } catch (err) {
    res.status(400).json({ message: "Error updating workshop" });
  }
};

const deleteWorkshop = async (req, res) => {
  try {
    await Workshop.findByIdAndDelete(req.params.id);
    res.json({ message: "Workshop deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting workshop" });
  }
};

module.exports = {
  getPublicWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop
};
