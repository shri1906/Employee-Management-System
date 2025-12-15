const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/roleMiddleware")("admin");
const ctrl = require("../controllers/userController");

router.post("/", auth, admin, ctrl.create);
router.get("/", auth, admin, ctrl.getAll);
router.get("/me", auth, ctrl.getMe);
router.put("/:id", auth, admin, ctrl.update);

module.exports = router;
