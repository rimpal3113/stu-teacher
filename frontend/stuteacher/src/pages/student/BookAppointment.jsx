"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { Calendar } from "../../components/ui/Calender";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avtar";
import { BookOpen, CalendarIcon, Clock, ArrowLeft } from "lucide-react";

export default function BookAppointment() {
  const { teacherId } = useParams();
console.log("teacherId from URL:", teacherId); // ✅ This should log a valid ID

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    subject: "",
    timeSlot: "",
    message: "",
    priority: "",
  });
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/teachers/profile/${teacherId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok) {
          setTeacher(data);
        } else {
          setError(data.message || "Failed to load teacher");
        }
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [teacherId]);
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

 const token = localStorage.getItem("token");
  console.log("📦 token:", token);

try {
  
  const res = await fetch("http://localhost:5000/api/appointments", {
  method: "POST",
  headers: {
     "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    teacherId,
    date: selectedDate.toISOString(),
    subject: formData.subject,
    timeSlot: formData.timeSlot,
    message: formData.message,
    priority: formData.priority,
  }),
});



  const data = await res.json();

  if (res.ok) {
    alert("Appointment booked successfully!");
    navigate(0);
  } else {
    alert(data.message || "Failed to book appointment");
  }
} catch (err) {
  alert("Server error");
  console.error("Booking error:", err);
}

  finally {
    setLoading(false);
  }
};



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading teacher info...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!teacher) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Teacher not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-[#2B59C3]" />
              <span className="text-xl font-bold text-gray-900">EduConnect</span>
            </div>
            <Link to="/student/dashboard">
              <Button variant="outline" className="bg-white text-[#2B59C3] border-[#2B59C3] hover:bg-[#2B59C3] hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Teacher Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={teacher.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {`${teacher.firstName?.[0] || ""}${teacher.lastName?.[0] || ""}`}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{teacher.firstName} {teacher.lastName}</CardTitle>
                <CardDescription>{teacher.department}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Subjects</h4>
                    <p className="text-gray-600">
                      {Array.isArray(teacher.subject)
                        ? teacher.subject.join(", ")
                        : teacher.subject || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Rating</h4>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-lg">★</span>
                      <span className="text-gray-600 ml-1">{teacher.rating || "N/A"} / 5.0</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                    <p className="text-gray-600 text-sm">{teacher.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Appointment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-[#2B59C3]" />
                  Book Appointment
                </CardTitle>
                <CardDescription>
                  Schedule a meeting with {teacher.firstName} {teacher.lastName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(teacher.subject) ? (
                          teacher.subject.map((subj) => (
                            <SelectItem key={subj} value={subj}>
                              {subj}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value={teacher.subject}>{teacher.subject}</SelectItem>
                        )}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Picker */}
                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <div className="border rounded-lg p-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                        className="rounded-md"
                      />
                    </div>
                  </div>

                  {/* Time Slots */}
                
{teacher.availableSlots && teacher.availableSlots.length > 0 ? (
  <div className="grid grid-cols-3 gap-2">
    {teacher.availableSlots.map((slot) => (
      <button
        key={slot}
        type="button"
        onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot }))}
        className={`p-2 border rounded-md ${
          formData.timeSlot === slot ? "bg-blue-600 text-white" : "bg-white text-gray-700"
        }`}
      >
        {slot}
      </button>
    ))}
  </div>
) : (
  <p>No time slots available for this teacher.</p>
)}

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General inquiry</SelectItem>
                        <SelectItem value="normal">Normal - Regular help needed</SelectItem>
                        <SelectItem value="high">High - Urgent assistance required</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Describe what you'd like to discuss..."
                      value={formData.message}
                      onChange={handleChange}
                      className="focus:ring-[#2B59C3] focus:border-[#2B59C3]"
                      rows={4}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-4">
                    <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full">
                      {submitting ? "Booking..." : "Book Appointment"}
                    </Button>
                    <Link to="/student/dashboard">
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
