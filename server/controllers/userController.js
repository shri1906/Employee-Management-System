const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.create = async (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  res.json(await User.create(req.body));
};

exports.getAll = async (req, res) => {
  res.json(await User.find().populate("department"));
};

exports.getMe = async (req, res) => {
  res.json(await User.findById(req.user.id).populate("department"));
};

exports.update = async (req, res) => {
  res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};
