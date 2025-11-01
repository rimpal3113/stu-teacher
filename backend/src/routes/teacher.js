// routes/teacherRoutes.js

import express from "express";
import { verifyToken ,authenticate} from "../middleware/authMiddleware.js";
import {
  approveAppointment,
  rejectAppointment,
  getAllTeachers,
  getTeacherById,
  getTeacherAppointments ,
} from "../controllers/teacherController.js";

const router = express.Router();

// ✅ Get all teachers (protected)
router.get("/appointments", authenticate, getTeacherAppointments);
router.patch("/appointments/:id/approve", verifyToken, approveAppointment);
router.patch("/appointments/:id/reject", verifyToken, rejectAppointment);

// ✅ General teacher routes after
router.get("/", getAllTeachers);
 // ✅ Now only matches /profile/123
router.get('/profile/:id', getTeacherById); // ✅ specific, avoids conflicts

export default router;
