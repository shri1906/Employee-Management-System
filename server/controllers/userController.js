const User = require("../models/User");
const bcrypt = require("bcryptjs");

//  EMPLOYEE ID GENERATOR

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

//  ADMIN CREATE USER

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
      isActive: true,
      profileImage: req.file ? `/uploads/users/${req.file.filename}` : null,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// USER SELF REGISTRATION

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, department, designation } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      department,
      designation,
      role: "user",
      isActive: false,
      profileImage: req.file ? `/uploads/users/${req.file.filename}` : null,
    });

    res.status(201).json({
      message: "Registration submitted. Await admin approval.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  GET ALL USERS (ADMIN)

exports.getAll = async (req, res) => {
  try {
    const users = await User.find()
      .populate("department", "name code")
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  GET LOGGED-IN USER

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("department", "name code")
      .select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  GET PENDING USERS (ADMIN)

exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      isActive: false,
      role: "user",
    })
      .populate("department", "name")
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// APPROVE USER (ADMIN)

exports.approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isActive) {
      return res.status(400).json({ message: "User already approved" });
    }

    user.employeeId = await generateEmployeeId();
    user.isActive = true;

    await user.save();

    res.json({
      message: "User approved successfully",
      employeeId: user.employeeId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  REJECT USER (ADMIN)

exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User rejected and removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  UPDATE USER (ADMIN)

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
    }).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
