import dotenv from 'dotenv';
import express from 'express';
import app from './app.js';
import connectDB from './utils/db.js';
import adminRoutes from './routes/admin.js';
import teacherRoutes from "./routes/teacher.js";
import studentRoutes from './routes/student.js';
import appointmentRoutes from './routes/appointment.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Mount routes
app.use('/api/admin', adminRoutes);
app.use('/api/teachers', teacherRoutes); 
app.use("/api/student", studentRoutes);
app.use("/api/appointments", appointmentRoutes);


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
