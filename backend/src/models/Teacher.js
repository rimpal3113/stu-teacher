// backend/src/models/Teacher.js
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String, required: true },
  password:  { type: String, required: true },
  department:{ type: String },
  subject:   { type: mongoose.Schema.Types.Mixed }, // support string or array
  bio:       { type: String },
  qualification: String,
  experience: String,
  role: { type: String, default: "teacher" },
  status: { type: String, default: "approved" },
  availableSlots: { type: [String], default: [] },
// ✅ NEW FIELD
  avatar: String,
  rating: Number,
});

export default mongoose.model("Teacher", teacherSchema);
