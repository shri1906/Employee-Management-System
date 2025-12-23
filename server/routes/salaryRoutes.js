const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const ctrl = require("../controllers/salaryController");

router.post("/", auth, role("admin"), ctrl.create);
router.get("/", auth, role("admin"), ctrl.getAll);
router.get("/:id/slip", auth, role("admin"), ctrl.downloadSlip);

router.get("/me", auth, ctrl.getMine);
router.get("/me/:id/slip", auth, ctrl.downloadSlip);

module.exports = router;
