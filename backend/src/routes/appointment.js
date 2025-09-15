// routes/appointmentRoutes.js
import express from "express";
import { bookAppointment, getAppointmentsByStudent } from "../controllers/appointmentController.js";
import { authenticate, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, bookAppointment);
router.get("/student", authenticate, getAppointmentsByStudent);

export default router;
