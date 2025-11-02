// routes/studentRoutes.js
import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  registerStudent,
  getStudentAppointments,
  sendMessageToTeacher,
  getStudentMessagesWithTeacher,
} from "../controllers/studentController.js";

const router = express.Router();

// Register a new student
router.post("/register", registerStudent);

// ✅ Get student's appointments + messages (single correct route)
router.get("/appointments", authenticate, getStudentAppointments);

// Send a message to a teacher
router.post("/send-message", authenticate, sendMessageToTeacher);

// Get all messages between student and a specific teacher
router.get("/messages/:teacherId", authenticate, getStudentMessagesWithTeacher);

export default router;
