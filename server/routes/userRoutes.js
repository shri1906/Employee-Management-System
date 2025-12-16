const router = require("express").Router();
const multer = require("multer");
const upload = multer();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/roleMiddleware")("admin");
const ctrl = require("../controllers/userController");

router.post("/", auth, admin, upload.none(), ctrl.create);
router.get("/", auth, admin, ctrl.getAll);
router.put("/:id", auth, admin, upload.none(), ctrl.update);
router.delete("/:id", auth, admin, ctrl.remove);
router.get("/me", auth, ctrl.getMe);

module.exports = router;
