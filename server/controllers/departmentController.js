const Department = require("../models/Department");

exports.create = async (req, res) => {
  const dept = await Department.create(req.body);
  res.json(dept);
};

exports.getAll = async (req, res) => {
  res.json(await Department.find());
};

exports.update = async (req, res) => {
  res.json(
    await Department.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
};

exports.remove = async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ message: "Department deleted" });
};

exports.getPublic = async (req, res) => {
  try {
    const data = await Department.find({ isActive: true }).select("_id name");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
