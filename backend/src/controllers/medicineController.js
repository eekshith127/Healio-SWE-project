const Medicine = require("../models/medicineModel");

// 📋 Get all medicines
exports.getAllMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    next(err);
  }
};

// 🔍 Get single medicine by ID
exports.getMedicineById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json(medicine);
  } catch (err) {
    next(err);
  }
};

// 🔍 Search medicines by name
exports.searchMedicines = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    const medicines = await Medicine.find({
      name: { $regex: q, $options: "i" },
    }).limit(30);
    res.json(medicines);
  } catch (err) {
    next(err);
  }
};

// ➕ Add new medicine
exports.addMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (err) {
    next(err);
  }
};

// ❌ Delete medicine by ID
exports.deleteMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Medicine.findByIdAndDelete(id);
    res.json({ message: "Medicine deleted successfully" });
  } catch (err) {
    next(err);
  }
};
