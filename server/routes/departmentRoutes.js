const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/roleMiddleware")("admin");
const ctrl = require("../controllers/departmentController");

router.post("/", auth, admin, ctrl.create);
router.get("/", auth, ctrl.getAll);
router.put("/:id", auth, admin, ctrl.update);
router.delete("/:id", auth, admin, ctrl.remove);

module.exports = router;
