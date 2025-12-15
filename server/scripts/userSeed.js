const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "../.env" });

const User = require("../models/User");
const connectDB = require("../config/db");

const createAdmin = async () => {
  try {
    // Connect to DB
    await connectDB();

    const email = "shivammaurya7310@gmail.com";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync("Admin@123", 10);

    // Create admin user (MATCHING SCHEMA)
    const admin = await User.create({
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "admin",
      designation: "Administrator",
      phone: "7310941087",
      isActive: true,
      department: null,               // admin may not belong to a department
      resetPasswordToken: undefined,
      resetPasswordExpire: undefined
    });

    console.log("✅ Admin user created successfully");
    console.log({
      email: admin.email,
      password: "Admin@123",
      role: admin.role
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
