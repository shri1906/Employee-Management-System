const User = require("../models/User");
const Department = require("../models/Department");
const Leave = require("../models/Leave");
const Salary = require("../models/Salary");
const Attendance = require("../models/Attendance");

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const today = new Date(
      new Date().toLocaleDateString("en-US", { timeZone: "+05:30" })
    );

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    const [
      totalUsers,
      totalDepartments,
      pendingLeaves,
      pendingRegistrations,
      totalSalaries,
      attendanceToday,
      salariesThisMonth,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Department.countDocuments(),
      Leave.countDocuments({ status: "Pending" }),
      User.countDocuments({ isActive: false }),
      Salary.countDocuments(),
      Attendance.find({ date: today }),
      Salary.find({ month, year }),
    ]);

    // Attendance summary
    const attendanceSummary = {
      Present: 0,
      Absent: 0,
      Leave: 0,
      Sick: 0,
    };

    attendanceToday.forEach((a) => {
      attendanceSummary[a.status]++;
    });

    // Salary summary
    const totalPayout = salariesThisMonth.reduce(
      (sum, s) => sum + s.netSalary,
      0
    );



    res.json({
      success: true,
      data: {
        cards: {
          totalUsers,
          totalDepartments,
          pendingLeaves,
          pendingRegistrations,
          totalSalaries,
        },
        attendanceSummary,
        salarySummary: {
          generated: salariesThisMonth.length,
          totalPayout,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date(
      new Date().toLocaleDateString("en-US", { timeZone: "+05:30" })
    );

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    const attendance = await Attendance.find({
      userId,
      date: { $gte: monthStart, $lte: monthEnd },
    });

    const attendanceSummary = {
      Present: 0,
      Absent: 0,
      Leave: 0,
      Sick: 0,
    };

    attendance.forEach((a) => {
      attendanceSummary[a.status]++;
    });

    const latestSalary = await Salary.findOne({ userId })
      .sort({ year: -1, month: -1 });

    const leaveTaken = await Leave.countDocuments({
      userId,
      status: "Approved",
    });

    res.json({
      success: true,
      data: {
        attendanceSummary,
        workingDays: attendance.length,
        leaveTaken,
        latestSalary,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
