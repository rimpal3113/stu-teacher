import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Admin from "../models/Admin.js";

// 🧩 Register
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
      const newTeacher = new Teacher({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        department,
        subject,
        bio,
      });
      await newTeacher.save();
      return res.status(201).json({ message: "Teacher registered successfully" });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧩 Login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please provide email, password, and role" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user;

    // 🔍 Find user based on role
    if (role === "teacher") user = await Teacher.findOne({ email: normalizedEmail });
    else if (role === "student") user = await Student.findOne({ email: normalizedEmail });
    else if (role === "admin") user = await Admin.findOne({ email: normalizedEmail });
    else return res.status(400).json({ message: "Invalid role provided" });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ JWT Token generation (this is the line you asked about)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,  // <-- defined in .env
      { expiresIn: "1d" }      // <-- valid for 1 day
    );

    // ✅ Send response to frontend
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
