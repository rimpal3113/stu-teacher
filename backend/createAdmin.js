import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./src/models/Admin.js"; // ✅ Correct model import

async function createAdmin() {
  await mongoose.connect("mongodb://localhost:27017/student-teacher-booking");

  const existingAdmin = await Admin.findOne({ email: "rimt13@gmail.com" });
  if (existingAdmin) {
    console.log("Admin already exists.");
    return mongoose.disconnect();
  }

  const hashedPassword = await bcrypt.hash("1331", 10);

  const admin = new Admin({
    firstName: "Admin",
    lastName: "User",
    email: "rimt13@gmail.com",
    phone: "1234567890",
    password: hashedPassword,
    role: "admin",
    department: "",
    subject: "",
    bio: "",
  });

  await admin.save();
  console.log("Admin user created!");
  mongoose.disconnect();
}

createAdmin();
