// models/Appointment.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  date: { type: Date, required: true },
  subject: { type: String, required: true },
  timeSlot: { type: String, required: true },
  priority: { type: String, enum: ["low", "normal", "high"], required: true },
  message: { type: String },
  status: { type: String, default: "pending" },
});

export default mongoose.model("Appointment", appointmentSchema);
