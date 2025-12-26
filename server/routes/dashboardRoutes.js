const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/roleMiddleware")("admin");
const ctrl = require("../controllers/dashboardController");

router.get("/admin", auth, admin, ctrl.getAdminDashboardStats);
router.get("/user", auth, ctrl.getUserDashboardStats);


module.exports = router;
