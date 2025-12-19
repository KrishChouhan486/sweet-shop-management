import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { sendOtpMail } from "../utils/sendOtpMail.js";
import { saveOTP, verifyOTP, clearOTP } from "../utils/otpStore.js";
import { OAuth2Client } from "google-auth-library";

// JWT
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// ===============================
// 📧 SEND OTP
// ===============================
export const sendRegisterOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    saveOTP(email, otp);
    await sendOtpMail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ===============================
// ✅ REGISTER WITH OTP
// ===============================
export const registerWithOTP = async (req, res) => {
  try {
    let { name, email, password, otp } = req.body;

    email = email.toLowerCase().trim();
    password = password.trim();

    if (!verifyOTP(email, otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. Please login." });
    }
    console.log("REGISTER RAW PASSWORD:", JSON.stringify(password));
console.log("REGISTER PASSWORD LENGTH:", password.length);

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password,
      role: "User",
    });
    console.log("REGISTER RAW PASSWORD:", JSON.stringify(password));
console.log("REGISTER PASSWORD LENGTH:", password.length);


    clearOTP(email);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ===============================
// 🔑 LOGIN
// ===============================
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    console.log("LOGIN RAW PASSWORD:", JSON.stringify(password));
    console.log("LOGIN PASSWORD LENGTH:", password?.length);

    email = email.toLowerCase().trim();
    password = password.trim();

    const user = await User.findOne({ email });
    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("DB HASH:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("BCRYPT MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ token: generateToken(user), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ===============================
// 🔐 GOOGLE LOGIN
// ===============================
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "GOOGLE_AUTH",
        role: "User",
      });
    }

    res.json({ token: generateToken(user), user });
  } catch (err) {
    res.status(401).json({ message: "Google login failed" });
  }
};
