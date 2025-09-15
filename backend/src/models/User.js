import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String, required: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['student', 'teacher', 'admin'], required: true },
  department:{ type: String },
  subject:   { type: String },
  bio:       { type: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;