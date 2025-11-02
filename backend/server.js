import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ CORS setup (allow frontend hosted on Vercel)
app.use(
  cors({
    origin: ["https://stu-teacher-kmq2.vercel.app"], // your frontend Vercel URL
    credentials: true,
  })
);

app.use(express.json());

// ✅ Import routes (correct relative path)
import authRoutes from "./src/routes/auth.js";
import adminRoutes from "./src/routes/admin.js";
import teacherRoutes from "./src/routes/teacher.js";
import studentRoutes from "./src/routes/student.js";
import appointmentRoutes from "./src/routes/appointment.js";

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "🎯 Student–Teacher Backend Running Successfully",
  });
});

// ✅ Connect MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // Only start server locally (Vercel handles it automatically)
    if (process.env.NODE_ENV !== "production") {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

// ✅ Export app for Vercel
export default app;
