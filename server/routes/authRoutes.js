const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/authController");

router.post("/login", ctrl.login);

// 🔐 Password APIs
router.post("/change-password", auth, ctrl.changePassword);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password/:token", ctrl.resetPassword);

module.exports = router;
