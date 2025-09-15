import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  department: String,
  subject: String,
  bio: String,
});

export default mongoose.model("Admin", adminSchema);
