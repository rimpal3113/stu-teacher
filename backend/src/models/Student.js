import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "student", // ✅ important
  },
   status: { type: String, default: "pending" }, 

}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
