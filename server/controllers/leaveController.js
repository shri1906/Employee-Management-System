const Leave = require("../models/Leave");

/**
 * USER: Apply leave
 */
exports.addLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, departmentId } = req.body;

    await Leave.create({
      userId: req.user._id,
      departmentId,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    return res.status(201).json({
      success: true,
      message: "Leave applied successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * USER: My leaves
 */
exports.myLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ADMIN: All leaves
 */
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("userId", "name")
      .populate("departmentId", "name");

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ADMIN: Update leave status
 */
exports.updateLeave = async (req, res) => {
  try {
    const { status } = req.body;

    await Leave.findByIdAndUpdate(req.params.id, {
      status,
      approvedBy: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Leave status updated",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
