const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Generate Employee ID
const generateEmployeeId = async () => {
  const year = new Date().getFullYear();

  const lastUser = await User.findOne({
    employeeId: new RegExp(`EMP-${year}`),
  }).sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastUser?.employeeId) {
    const lastSeq = parseInt(lastUser.employeeId.split("-").pop());
    nextNumber = lastSeq + 1;
  }

  return `EMP-${year}-${String(nextNumber).padStart(3, "0")}`;
};


// CREATE USER
exports.create = async (req, res) => {
  try {
    const { name, email, password, role, department, designation, phone } =
      req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employeeId = await generateEmployeeId();

    const user = await User.create({
      employeeId,
      name,
      email,
      password: hashedPassword,
      role,
      department,
      designation,
      phone,
      profileImage: req.file ? `/uploads/users/${req.file.filename}` : null,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// GET ALL USERS
exports.getAll = async (req, res) => {
  try {
    const users = await User.find()
      .populate("department", "name code")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "department",
      "name code"
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE USER
exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.password && req.body.password.trim() !== "") {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    } else {
      delete updateData.password;
    }

    if (req.file) {
      updateData.profileImage = `/uploads/users/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE USER
exports.remove = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
