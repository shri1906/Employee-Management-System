const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  date: Date,
  status: { type: String, enum: ["Present", "Absent", "Leave"] }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
