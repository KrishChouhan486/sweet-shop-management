import dotenv from "dotenv";
dotenv.config();

import { transporter } from "./config/mailer.js";

if (process.env.NODE_ENV !== "production") {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "Krishchouhan468@gmail.com",
    subject: "OTP Test",
    text: "OTP system is working 🚀",
  });

  console.log("MAIL SENT (LOCAL)");
} else {
  console.log("📧 MAIL SKIPPED IN PRODUCTION");
}
