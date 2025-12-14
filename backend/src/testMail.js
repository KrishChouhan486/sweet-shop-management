import dotenv from "dotenv";
dotenv.config();

import { transporter } from "./config/mailer.js";

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: "Krishchouhan468@gmail.com",
  subject: "OTP Test",
  text: "OTP system is working 🚀",
});

console.log("MAIL SENT");
