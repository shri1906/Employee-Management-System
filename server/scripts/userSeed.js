const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "../.env" });

const User = require("../models/User");
const connectDB = require("../config/db");

const createAdmin = async () => {
  try {
    // Connect to DB
    await connectDB();

    const email = "user@gmail.com";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync("User@123", 10);

    // Create admin user (MATCHING SCHEMA)
    const admin = await User.create({
      name: "User",
      email,
      password: hashedPassword,
      role: "user",
      designation: "IT Specialist",
      phone: "1234567890",
      isActive: true,
      department: null,               // admin may not belong to a department
      resetPasswordToken: undefined,
      resetPasswordExpire: undefined
    });

    console.log("✅ Admin user created successfully");
    console.log({
      email: admin.email,
      password: "User@123",
      role: admin.role
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
