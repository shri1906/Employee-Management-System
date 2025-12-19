const Attendance = require("../models/Attendance.js");
const User = require("../models/User.js");

//  ADMIN: Get today's attendance (all users)

exports.getTodayAttendance = async (req, res) => {
  try {
   
    const today = new Date(new Date().toLocaleDateString("en-US", { timeZone: "+05:30" }));
    const users = await User.find({ role: "user" })
      .populate("department", "name")
      .select("_id name department");

    const attendance = await Attendance.find({ date: today });
    const attendanceMap = {};
    attendance.forEach((a) => {
      attendanceMap[a.userId.toString()] = a;
    });

    const result = users.map((user) => {
      const record = attendanceMap[user._id.toString()];

      return {
        userId: user._id,
        name: user.name,
        departmentId: user.department?._id || null,
        departmentName: user.department?.name || "-",
        status: record ? record.status : "Absent", 
      };
    });

    return res.status(200).json({
      success: true,
      attendance: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ADMIN: Mark / Update attendance for today

exports.markAttendance = async (req, res) => {
  try {
    const { userId, departmentId, status } = req.body;

    const today = new Date(new Date().toLocaleDateString("en-US", { timeZone: "+05:30" }));

    const attendance = await Attendance.findOneAndUpdate(
      { userId, date: today },
      {
        userId,
        departmentId,
        status,
        date: today,
        markedBy: req.user._id,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//  ADMIN: Attendance report (date-wise)

exports.attendanceReport = async (req, res) => {
  try {
    const { date } = req.query;
    const query = {};

    if (date) {
      const d = new Date(new Date(date).toLocaleDateString("en-US", { timeZone: "+05:30" }));
      query.date = d;
    }

    const attendance = await Attendance.find(query)
      .populate("userId", "name")
      .populate("departmentId", "name")
      .sort({ date: -1 });

    return res.status(200).json({ success: true, attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//  ADMIN: Monthly Attendance Summary

exports.monthlyAttendanceReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ success: false, message: "Month & Year required" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const attendance = await Attendance.find({
      date: { $gte: start, $lte: end },
    })
      .populate("userId", "name")
      .populate("departmentId", "name")
      .sort({ date: 1 });

    const result = {};

    attendance.forEach((rec) => {
      const uid = rec.userId._id.toString();
      if (!result[uid]) {
        result[uid] = {
          userId: uid,
          name: rec.userId.name,
          department: rec.departmentId.name,
          attendance: {},
        };
      }

      result[uid].attendance[rec.date.toLocaleDateString("en-US", { timeZone: "+05:30" })] =
        rec.status.charAt(0);
    });

    return res.status(200).json({
      success: true,
      data: Object.values(result),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// USER: View own attendance

exports.myAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.user._id })
      .sort({ date: -1 })
      .populate("departmentId", "name");

    return res.status(200).json({ success: true, attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// USER: Monthly Attendance (own only)
exports.myMonthlyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ success: false, message: "Month & Year required" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const attendance = await Attendance.find({
      userId: req.user._id, // ✅ ONLY OWN DATA
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    const result = {};

    attendance.forEach((rec) => {
      result[rec.date.toLocaleDateString("en-US", { timeZone: "+05:30" })] = rec.status.charAt(0); // P / A / L / S
    });
    return res.status(200).json({
      success: true,
      attendance: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
