const Attendance = require("../models/Attendance");

exports.create = async (req, res) => {
  res.json(await Attendance.create(req.body));
};

exports.getAll = async (req, res) => {
  res.json(await Attendance.find().populate("userId departmentId"));
};

exports.getMine = async (req, res) => {
  res.json(await Attendance.find({ userId: req.user.id }));
};
