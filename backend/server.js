import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import adminRoutes from "./src/routes/admin.js";
import teacherRoutes from "./src/routes/teacher.js";
import studentRoutes from "./src/routes/student.js";
import appointmentRoutes from "./src/routes/appointment.js";
import authRoutes from "./src/routes/auth.js";

dotenv.config();
const app = express();

// ✅ CORS for your frontend hosted on Vercel
app.use(
  cors({
    origin: "https://stu-teacher-kmq2.vercel.app", // frontend vercel domain
    credentials: true,
  })
);
app.use(express.json());

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running ✅" });
});

// ✅ Export app (Vercel requires this)
export default app;
