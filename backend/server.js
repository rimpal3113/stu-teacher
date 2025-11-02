import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "../backend/src/routes/auth.js";
import adminRoutes from "../backend/src/routes/admin.js";
import teacherRoutes from "../backend/src/routes/teacher.js";
import studentRoutes from "../backend/src/routes/student.js";
import appointmentRoutes from "../backend/src/routes/appointment.js";

dotenv.config();

const app = express();

// ✅ CORS fix (for both frontend & local dev)
app.use(
  cors({
    origin: [
      "https://stu-teacher-kmq2.vercel.app", // ✅ your frontend deployed URL
      "http://localhost:5173",               // ✅ for local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle all OPTIONS preflight requests
app.options("*", cors());

// ✅ Middleware
app.use(express.json());

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("✅ Server running successfully with full CORS support!");
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;
