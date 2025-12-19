import dotenv from "dotenv";
dotenv.config(); // 👈 yahin rehne do

import app from "./app.js";
import connectDB from "./config/db.js";

console.log("BREVO_USER:", process.env.BREVO_USER);
console.log("BREVO_PASS LOADED:", !!process.env.BREVO_PASS);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
