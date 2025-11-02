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
app.use(express.json());

// ✅ CORS Configuration (important!)
app.use(
  cors({
    origin: [
      "https://stu-teacher-kmq2.vercel.app", // your frontend
      "http://localhost:5173",               // local dev (optional)
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Handle preflight requests explicitly
app.options("*", cors());

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("✅ Server running successfully on Vercel!");
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;
