const express = require("express");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const ctrl = require("../controllers/attendanceController");

const router = express.Router();

/** ADMIN */
router.get("/today", auth, role("admin"), ctrl.getTodayAttendance);
router.post("/mark", auth, role("admin"), ctrl.markAttendance);
router.get("/report", auth, role("admin"), ctrl.attendanceReport);
router.get("/monthly-report", auth, role("admin"), ctrl.monthlyAttendanceReport);

/** USER */
router.get("/me", auth, ctrl.myAttendance);
router.get("/my-monthly", auth, ctrl.myMonthlyAttendance);

module.exports = router;
