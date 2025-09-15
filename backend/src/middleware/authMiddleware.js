import jwt from 'jsonwebtoken';
import Student from "../models/Student.js"; // ✅ Ensure this path is correct
import Teacher from "../models/Teacher.js";
import Admin from "../models/Admin.js"; // ✅ Ensure this path is correct


export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 authHeader:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No valid auth header");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    console.log("🎟 Extracted token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    const userId = decoded.id || decoded._id; // ✅ Fallback for broken tokens

    let user;

    if (decoded.role === "student") {
      user = await Student.findById(userId).select("-password");
      console.log("👤 Student found:", user);
    } else if (decoded.role === "teacher") {
      user = await Teacher.findById(userId).select("-password");
      console.log("👤 Teacher found:", user);
    } else if (decoded.role === "admin") {
      user = await Admin.findById(userId).select("-password");
      console.log("👤 Admin found:", user);
    }

    if (!user) {
      console.log("❌ User not found in DB for decoded.id:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ JWT error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};




export const adminAuth = (req, res, next) => {
  console.log("🔍 req.user in adminAuth:", req.user); // Debug log

  const user = req.user;
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. No user role found." });
  }
  next();
};

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; // ✅ this is important
    next();
  } catch (err) {
    console.error("Token error:", err.message);
    return res.status(403).json({ message: "Invalid token" });
  }
};

