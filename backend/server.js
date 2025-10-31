// server.local.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import adminRoutes from "./src/routes/admin.js";
import teacherRoutes from "./src/routes/teacher.js";
import studentRoutes from "./src/routes/student.js";
import appointmentRoutes from "./src/routes/appointment.js";

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // local frontend
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.json({ activeStatus: true, error: false });
});

// Connect DB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `🚀 Server running on http://localhost:${process.env.PORT || 5000}`
      );
    });
  })
  .catch((err) => console.error("❌ DB connection error:", err));
