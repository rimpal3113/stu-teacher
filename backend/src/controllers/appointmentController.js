import Appointment from '../models/Appointment.js';

// controllers/appointmentController.js
export const bookAppointment = async (req, res) => {
  try {
    const { teacherId, date, subject, timeSlot, message, priority } = req.body;

    if (!teacherId || !date || !subject || !timeSlot || !priority) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // ✅ Use the user from the auth middleware
    const studentId = req.user._id;

    const newAppointment = new Appointment({
      student: studentId,
      teacher: teacherId,
      date,
      subject,
      timeSlot,
      message,
      priority,
      status: "pending",
    });

    await newAppointment.save();

    res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
  } catch (error) {
    console.error("❌ Error booking appointment:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAppointmentsByStudent = async (req, res) => {
  try {
    const appointments = await Appointment.find({ studentId: req.user._id })
      .populate("teacherId", "firstName lastName subject avatar") // ✅ Get teacher info
      .sort({ date: -1 }); // Optional: latest first

    res.status(200).json(appointments);
  } catch (err) {
    console.error("❌ Error fetching student appointments:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
