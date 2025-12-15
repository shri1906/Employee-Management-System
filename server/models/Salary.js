const mongoose = require("mongoose");

const SalarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  month: Number,
  year: Number,
  basic: Number,
  hra: Number,
  allowance: Number,
  deduction: Number,
  netSalary: Number
}, { timestamps: true });

module.exports = mongoose.model("Salary", SalarySchema);
