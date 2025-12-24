const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ user, token });
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }

  user.password = bcrypt.hashSync(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully" });
};

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

  await user.save();

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset.</p>
      <p>Click below link to reset password:</p>
      <a href="${resetURL}">${resetURL}</a>
      <p>This link expires in 15 minutes.</p>
    `
  });

  res.json({ message: "Password reset email sent" });
};

exports.resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = bcrypt.hashSync(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};
