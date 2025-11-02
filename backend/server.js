import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import routes
import adminRoutes from "./src/routes/admin.js";
import teacherRoutes from "./src/routes/teacher.js";
import studentRoutes from "./src/routes/student.js";
import appointmentRoutes from "./src/routes/appointment.js";
import authRoutes from "./src/routes/auth.js";

dotenv.config();
const app = express();

// ✅ MANUAL CORS FIX (WORKS ON VERCEL)
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://stu-teacher-kmq2.vercel.app", // frontend deployed
    "http://localhost:5173"                // optional local dev
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // ✅ stop preflight error
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};
await connectDB();

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.json({ message: "Backend running on Vercel ✅" });
});

// ✅ Export for Vercel
export default app;
