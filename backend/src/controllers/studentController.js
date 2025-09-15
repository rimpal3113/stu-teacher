import Appointment from "../models/Appointment.js";
// src/controllers/studentController.js
import Message from "../models/Message.js";
import Teacher from "../models/Teacher.js";

export const sendMessageToTeacher = async (req, res) => {
  try {
    const { teacherId, message } = req.body;
  const studentId = req.user?._id; // ✅ use _id because req.user is a Mongoose document


    // Debug: Log incoming data
    console.log("📥 Message Request Body:", req.body);
    console.log("👤 Authenticated Student ID:", studentId);

    if (!teacherId || !message) {
      return res.status(400).json({ message: "Teacher ID and message are required." });
    }

    const newMessage = await Message.create({
      student: studentId,
      teacher: teacherId,
      message,
      sender: "student",
    });

    res.status(201).json({ message: "Message sent", data: newMessage });
  } catch (err) {
    console.error("❌ Send message error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const registerStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save student
    const student = new Student({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await student.save(); // ✅ stores student in MongoDB

    // Generate token
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    console.log("➡️ req.user:", req.user); // ✅ Check this logs correct student ID

    const { teacherId, subject, date, timeSlot, priority, message } = req.body;

    const appointment = new Appointment({
      teacher: teacherId,
      student: req.user.id, // ✅ This must come from token
      subject,
      date,
      timeSlot,
      priority,
      message,
    });

    await appointment.save();

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    console.error("❌ Error booking appointment:", err.message);
    res.status(500).json({ message: err.message || "Server error" });
  }
};



// controllers/studentController.js
export const getStudentAppointments = async (req, res) => {
  try {
    const studentId = req.user._id;

    const appointments = await Appointment.find({ student: studentId })
      .populate("teacher", "firstName lastName avatar subject") // Ensure `teacher` field is populated
      .sort({ date: -1 });

    const formatted = appointments.map((appt) => ({
      _id: appt._id,
      teacher: `${appt.teacher.firstName} ${appt.teacher.lastName}`,
      teacherAvatar: appt.teacher.avatar || null,
      subject: appt.subject,
      date: appt.date,
      timeSlot: appt.timeSlot,
      priority: appt.priority,
      message: appt.message,
      status: appt.status,
    }));

    res.status(200).json({ appointments: formatted });
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getStudentMessagesWithTeacher = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { teacherId } = req.params;

    const teacher = await Teacher.findById(teacherId).select("name subject");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const messages = await Message.find({
      student: studentId,
      teacher: teacherId,
    }).sort({ createdAt: 1 }); // Oldest to newest

    res.json({ teacher, messages });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
