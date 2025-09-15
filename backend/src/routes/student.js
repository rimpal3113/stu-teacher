import express from 'express';
import Appointment from '../models/Appointment.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { registerStudent,   getStudentAppointments,sendMessageToTeacher, getStudentMessagesWithTeacher   } from "../controllers/studentController.js";
const router = express.Router();

router.post("/register", registerStudent);
router.get("/appointments", authenticate, getStudentAppointments); 
// ✅ Get student's appointments and messages
router.get('/appointments', authenticate, async (req, res) => {
  try {
    const studentId = req.user.id;

    const appointments = await Appointment.find({ student: studentId })
      .populate('teacher', 'firstName lastName subject avatar')
      .sort({ date: 1 });

    const messages = []; // Optional: fetch student messages if you have a Message model

    res.status(200).json({
      upcoming: appointments,
      messages,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/appointments", authenticate, getStudentAppointments);

// Send a new message to teacher
router.post("/send-message", authenticate, sendMessageToTeacher);

// Get messages with a specific teacher
router.get("/messages/:teacherId", authenticate, getStudentMessagesWithTeacher);

export default router;
