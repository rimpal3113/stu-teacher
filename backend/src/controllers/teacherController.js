import Teacher from '../models/Teacher.js';
import Appointment from '../models/Appointment.js';
// ...existing code...
import Message from "../models/Message.js";
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find(); // ✅ Should return array
    res.json(teachers);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve an appointment
export const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment approved", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reject an appointment
export const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment rejected", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    console.log("Requested teacherId:", req.params.id); // ✅ correct param name

    const teacher = await Teacher.findById(req.params.id).select("-__v");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      _id: teacher._id,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      subject: teacher.subject,
      department: teacher.department,
      avatar: teacher.avatar,
      bio: teacher.bio,
      rating: teacher.rating,
      availableSlots: teacher.availableSlots,
    });
  } catch (err) {
    console.error("Error fetching teacher:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTeacherAppointments = async (req, res) => {
  const teacherId = req.user._id;

  try {
    const allAppointments = await Appointment.find({ teacher: teacherId }).populate("student", "name email");

    const pending = allAppointments.filter(a => a.status === "pending");
    const upcoming = allAppointments.filter(a => a.status === "confirmed");

    const messages = await Message.find({ teacher: teacherId })
      .populate("student", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      pending,
      upcoming,
      messages,
    });
  } catch (err) {
    console.error("❌ getTeacherAppointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

