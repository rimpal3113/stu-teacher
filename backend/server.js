import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import adminRoutes from "./src/routes/admin.js";
import teacherRoutes from "./src/routes/teacher.js";
import studentRoutes from "./src/routes/student.js";
import appointmentRoutes from "./src/routes/appointment.js";
import authRoutes from "./src/routes/auth.js";

// Load environment variables
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

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send({
    message: "🎯 Student–Teacher Booking Backend Running Successfully",
    status: true,
  });
});

// ✅ Connect MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
