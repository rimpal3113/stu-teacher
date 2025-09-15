import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Admin from "../models/Admin.js"; // ✅ Add this

// (optional) import generateToken if you use it


export const register = async (req, res) => {
  const { firstName, lastName, email, phone, password, role, department, subject, bio } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "student") {
      const newStudent = new Student({ firstName, lastName, email, phone, password: hashedPassword });
      await newStudent.save();
      return res.status(201).json({ message: "Student registered successfully" });
    }

    if (role === "teacher") {
      const newTeacher = new Teacher({ firstName, lastName, email, phone, password: hashedPassword, department, subject, bio });
      await newTeacher.save();
      return res.status(201).json({ message: "Teacher registered successfully" });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// Login a user

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const normalizedEmail = email.trim().toLowerCase(); // ✅ normalize email

    let user;

    // 🔍 Fetch user from the right collection
    if (role === "teacher") {
      user = await Teacher.findOne({ email: normalizedEmail });
    } else if (role === "student") {
      user = await Student.findOne({ email: normalizedEmail });
    } else if (role === "admin") {
      user = await Admin.findOne({ email: normalizedEmail });
    } else {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Password not set for this user" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};