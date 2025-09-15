// setTeacherPassword.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Teacher from "./src/models/Teacher.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const hashed = await bcrypt.hash("5678", 10);

await Teacher.updateOne(
  { email: "shivani31@gmail.com" },
  { $set: { password: hashed } }
);

console.log("✅ Password updated for shivani31@gmail.com");
mongoose.disconnect();
