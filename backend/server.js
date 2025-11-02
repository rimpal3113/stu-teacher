import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// ✅ Import routes
import adminRoutes from "./src/routes/admin.js";
import teacherRoutes from "./src/routes/teacher.js";
import studentRoutes from "./src/routes/student.js";
import appointmentRoutes from "./src/routes/appointment.js";
import authRoutes from "./src/routes/auth.js";

dotenv.config();
const app = express();

// ✅ CORS setup for your frontend hosted on Vercel
app.use(
  cors({
    origin: "https://stu-teacher-kmq2.vercel.app", // your frontend domain
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};
await connectDB();

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Default test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎯 Student-Teacher Backend Running Successfully!",
  });
});

// ✅ Export for Vercel
export default app;
