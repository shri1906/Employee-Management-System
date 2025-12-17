const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/roleMiddleware")("admin");
const ctrl = require("../controllers/userController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

router.post("/", auth, admin, upload.single("profileImage"), ctrl.create);
router.get("/", auth, admin, ctrl.getAll);
router.put("/:id", auth, admin, upload.single("profileImage"), ctrl.update);
router.delete("/:id", auth, admin, ctrl.remove);
router.get("/me", auth, ctrl.getMe);

module.exports = router;
