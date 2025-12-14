import express from "express";
import {
  sendRegisterOTP,
  registerWithOTP,
  loginUser,
  googleLogin,
} from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/send-otp", sendRegisterOTP);
router.post("/register", registerWithOTP);
router.post("/login", loginUser);
router.post("/google", googleLogin); // ✅ ADD THIS

export default router;
