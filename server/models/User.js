const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  role: { type: String, enum: ["admin", "user"], default: "user" },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  designation: String,
  phone: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
