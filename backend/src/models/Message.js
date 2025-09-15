// src/models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    message: String,
    sender: String, // "student" or "teacher"
  },
  { timestamps: true } // ✅ this adds createdAt and updatedAt
);


export default mongoose.model("Message", messageSchema);
