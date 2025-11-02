import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Routes
import adminRoutes from "./routes/admin.js";
import teacherRoutes from "./routes/teacher.js";
import studentRoutes from "./routes/student.js";
import appointmentRoutes from "./routes/appointment.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ✅ CORS fix for frontend (Vercel)
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://stu-teacher-kmq2.vercel.app" // your frontend link
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// ✅ Connect MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};
await connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Root check
app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully ✅" });
});

// ✅ Export for Vercel
export default app;
