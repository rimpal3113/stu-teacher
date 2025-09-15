import Teacher from '../models/Teacher.js';
import mongoose from "mongoose";
// Add a new teacher (simple version)
import bcrypt from "bcryptjs";


// backend/src/controllers/teacherController.js
export const createTeacher = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      department,
      subject,
      bio,
      qualification,
      experience,
      availableSlots, // ✅ ADD THIS
    } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      department,
      subject,
      bio,
      qualification,
      experience,
      availableSlots, // ✅ SAVE THIS
      role: "teacher",
      status: "approved",
    });

    await newTeacher.save();
    res.status(201).json({ message: "Teacher added successfully" });
  } catch (err) {
    console.error("❌ Error creating teacher:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const addTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json({ message: "Teacher added successfully", teacher });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ status: "active" }); // status matters!
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
};




export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData.email) {
      updateData.email = updateData.email.trim().toLowerCase();
    }
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({ message: 'Teacher updated successfully', teacher: updatedTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Error updating teacher', error: error.message });
  }
};
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete teacher" });
  }
};


export const getTeacherById = async (req, res) => {
  const { id } = req.params;
  console.log("Looking for teacher with ID:", id); // ✅ log it

  try {
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      console.log("Teacher not found for ID:", id); // ✅ log not found
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  } catch (error) {
    console.error("Error fetching teacher by ID:", error); // ✅ log error
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/adminController.js
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("student", "firstName lastName email")
      .populate("teacher", "firstName lastName email");
    res.json({ appointments });
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};