import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// ✅ Correct imports (adjust based on your structure)
import authRoutes from "../backend/src/routes/auth.js";
import adminRoutes from "../backend/src/routes/admin.js";
import teacherRoutes from "../backend/src/routes/teacher.js";
import studentRoutes from "../backend/src/routes/student.js";
import appointmentRoutes from "../backend/src/routes/appointment.js";

dotenv.config();

const app = express();

// ✅ CORS setup — FIXED (you had `app.use(app.use(...))` which broke it)
app.use(
  cors({
    origin: [
      "https://stu-teacher-kmq2.vercel.app", // ✅ Your live frontend
      "http://localhost:5173",               // ✅ For local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ Ensure preflight (OPTIONS) requests are handled globally
app.options("*", cors());

// ✅ Middleware
app.use(express.json());

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Root route to check CORS
app.get("/", (req, res) => {
  res.send("✅ Server running successfully with CORS enabled!");
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Local server for testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;
