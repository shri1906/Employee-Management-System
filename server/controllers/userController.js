const User = require("../models/User");
const bcrypt = require("bcryptjs");


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
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      designation,
      phone,
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

    // Hash password ONLY if provided
    if (req.body.password && req.body.password.trim() !== "") {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    } else {
      delete updateData.password;
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
