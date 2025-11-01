// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import adminRoutes from "./src/routes/admin.js";
import teacherRoutes from "./src/routes/teacher.js";
import studentRoutes from "./src/routes/student.js";
import appointmentRoutes from "./src/routes/appointment.js";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "https://stu-teacher-orpin.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/appointments", appointmentRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is active", status: "✅ running" });
});

// ✅ MongoDB Connection
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection failed:", err.message));
}

// 👇 Export the app for Vercel (serverless)
export default app;
