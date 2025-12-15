const Salary = require("../models/Salary");

exports.create = async (req, res) => {
  req.body.netSalary =
    req.body.basic + req.body.hra + req.body.allowance - req.body.deduction;
  res.json(await Salary.create(req.body));
};

exports.getAll = async (req, res) => {
  res.json(await Salary.find().populate("userId departmentId"));
};

exports.getMine = async (req, res) => {
  res.json(await Salary.find({ userId: req.user.id }));
};
