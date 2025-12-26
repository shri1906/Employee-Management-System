const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const admin = role("admin");
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
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

router.post("/register", upload.single("profileImage"), ctrl.register);

router.get("/me", auth, ctrl.getMe);

router.post("/", auth, admin, upload.single("profileImage"), ctrl.create);

router.get("/", auth, admin, ctrl.getAll);

router.get("/pending", auth, admin, ctrl.getPendingUsers);

router.put("/:id/approve", auth, admin, ctrl.approveUser);

router.delete("/:id/reject", auth, admin, ctrl.rejectUser);

router.put("/:id", auth, admin, upload.single("profileImage"), ctrl.update);

module.exports = router;
