const Salary = require("../models/Salary");
const generateSlip = require("../utils/salarySlipPDF");
const generatePdfBuffer = require("../utils/salarySlipPDFBuffer");
const sendEmail = require("../utils/emailSalarySlip");

// ================= CREATE SALARY =================
exports.create = async (req, res) => {
  try {
    const { earnings, deductions } = req.body;

    const grossSalary =
      earnings.basic +
      earnings.hra +
      earnings.conveyance +
      earnings.medical +
      earnings.specialAllowance;

    const totalDeductions =
      deductions.pf + deductions.esi + deductions.tax + deductions.other;

    const netSalary = grossSalary - totalDeductions;

    const salary = await Salary.create({
      ...req.body,
      grossSalary,
      totalDeductions,
      netSalary,
      generatedBy: req.user.id,
    });

    res.status(201).json(salary);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Salary already generated for this month" });
    }
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL (ADMIN) =================
exports.getAll = async (req, res) => {
  const data = await Salary.find()
    .populate("userId", "name email employeeId")
    .populate("departmentId", "name");
  res.json(data);
};

// ================= GET MINE (USER) =================
exports.getMine = async (req, res) => {
  const data = await Salary.find({ userId: req.user.id }).sort({
    year: -1,
    month: -1,
  });
  res.json(data);
};

// ================= DOWNLOAD SLIP =================
exports.downloadSlip = async (req, res) => {
  const salary = await Salary.findById(req.params.id)
    .populate("userId")
    .populate("departmentId");

  if (!salary) {
    return res.status(404).json({ message: "Not found" });
  }

  // 🔐 Admin OR owner
  if (
    req.user.role !== "admin" &&
    salary.userId._id.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  generateSlip(res, salary, salary.userId, salary.departmentId);
};

// ================= EMAIL SLIP (ADMIN ONLY) =================
exports.emailSalarySlip = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id)
      .populate("userId", "name email employeeId")
      .populate("departmentId", "name");

    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    // 🔐 Admin only
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const pdfBuffer = await generatePdfBuffer(
      salary,
      salary.userId,
      salary.departmentId
    );

    await sendEmail({
      to: salary.userId.email,
      pdfBuffer,
      month: salary.month,
      year: salary.year,
    });

    res.json({ message: "Salary slip emailed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to email salary slip" });
  }
};
