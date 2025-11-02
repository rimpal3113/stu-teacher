import express from 'express';
import {
  addTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
  createTeacher,getAllAppointments
} from '../controllers/adminController.js';
import { authenticate, adminAuth } from '../middleware/authMiddleware.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Appointment from '../models/Appointment.js'; // ✅ Missing import

const router = express.Router();
router.use(corsConfig); 

// ✅ Protect all admin routes
router.use(authenticate);
router.use(adminAuth);

// ✅ Create a new teacher (only use ONE route)
router.post('/teachers', createTeacher);

// ✅ Get all teachers
router.get('/teachers', getAllTeachers);

// ✅ Get teacher by ID
router.get('/teachers/:id', getTeacherById);

// ✅ Update teacher
router.put('/teachers/:id', updateTeacher);

// ✅ Delete teacher
router.delete('/teachers/:id', deleteTeacher);
// routes/admin.js
router.get("/appointments", authenticate, getAllAppointments);

// ✅ Admin Dashboard Stats
// routes/admin.js
// ✅ Admin Dashboard Stats
router.get('/system-stats', async (req, res) => {
  try {
       console.log("📊 /system-stats route hit");
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const pendingApprovals = await Teacher.countDocuments({ status: 'pending' });

    res.json({ totalStudents, totalTeachers, totalAppointments, pendingApprovals });
  } catch (error) {
    console.error('System stats error:', error);
    res.status(500).json({ message: 'Failed to fetch system stats' });
  }
});





// ✅ Pending Teacher Registrations
router.get('/pending-registrations', async (req, res) => {
  try {
    const pendingTeachers = await Teacher.find({ status: "pending" });
    res.json(pendingTeachers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending registrations" });
  }
});

// ✅ Optional Admin Dashboard Message
router.get('/admin/dashboard', (req, res) => {
  res.send('Welcome Admin!');
});
// GET /api/admin/pending-students
router.get("/pending-students", authenticate, async (req, res) => {
  try {
    const students = await Student.find({ status: "pending" }).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// PUT /api/admin/approve-student/:id
router.put("/approve-student/:id", authenticate, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).select("-password");

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student approved", student });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
