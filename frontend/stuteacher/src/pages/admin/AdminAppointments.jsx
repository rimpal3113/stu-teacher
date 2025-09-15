// src/pages/admin/AdminAppointments.jsx
import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);

 useEffect(() => {
  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/admin/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("📦 Admin Appointments:", data);
    if (res.ok) {
      setAppointments(data.appointments || []);
    } else {
      console.error("❌ Fetch error:", data);
    }
  };

  fetchAppointments();
}, []);


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex items-center mb-6">
        <Calendar className="text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">All Appointments</h1>
      </header>

     {appointments.length === 0 ? (
  <p className="text-center py-10 text-gray-500">No appointments found.</p>
) : (
  <div className="space-y-4">
    {appointments.map((appt) => (
      <div key={appt._id} className="p-4 border rounded shadow">
        <p><strong>Student:</strong> {appt.student?.firstName} {appt.student?.lastName}</p>
        <p><strong>Teacher:</strong> {appt.teacher?.firstName} {appt.teacher?.lastName}</p>
        <p><strong>Subject:</strong> {appt.subject}</p>
        <p><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {appt.timeSlot}</p>
        <p><strong>Status:</strong> {appt.status}</p>
      </div>
    ))}
  </div>
)}


    </div>
  );
}
