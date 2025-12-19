import transporter from "../config/mailer.js";

export const sendOtpMail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: "Sweet Shop <krishchouhan468@gmail.com>", // ✅ VERIFIED SENDER (Brevo)
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial; padding: 20px">
          <h2>Verify your email</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log("📩 OTP sent to", email);
  } catch (err) {
    console.error("❌ OTP MAIL ERROR (sendOtpMail):", err);
    throw err;
  }
};
