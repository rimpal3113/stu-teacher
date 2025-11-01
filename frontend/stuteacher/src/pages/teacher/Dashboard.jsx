"use client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  LogOut,
  Eye,
  User,
  Plus,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";

export default function TeacherDashboard() {
  const { user, token, logout } = useAuth();
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("https://stu-teacher-orpin.vercel.app/api/teacher/appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setPendingAppointments(data.pending || []);
          setUpcomingAppointments(data.upcoming || []);
          setRecentMessages(data.messages || []);
        } else {
          console.error("❌ Failed to load appointments:", data.message);
        }
      } catch {
        console.error("❌ Server error while fetching appointments");
      }
    };

    if (token) fetchAppointments();
  }, [token]);

  const handleApprove = async (id) => {
    const res = await fetch(`https://stbackend-pied.vercel.app/api/teacher/appointments/${id}/approve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      alert("Appointment approved!");
      setPendingAppointments((prev) => prev.filter((a) => a._id !== id));
      setUpcomingAppointments((prev) => [...prev, data.appointment]);
    } else {
      alert(data.message || "Approval failed");
    }
  };

  const handleReject = async (id) => {
    const res = await fetch(`https://stbackend-pied.vercel.app/api/teacher/appointments/${id}/reject`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      alert("Appointment rejected!");
      setPendingAppointments((prev) => prev.filter((a) => a._id !== id));
    } else {
      alert(data.message || "Rejection failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EduConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.firstName || user?.name?.split(" ")[0]}
              </span>
              <Button
                variant="outline"
                className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card><CardContent className="p-6"><div className="flex items-center"><Calendar className="h-6 w-6 text-blue-600" /><div className="ml-4"><p className="text-sm text-gray-600">Total Appointments</p><p className="text-xl font-bold">{pendingAppointments.length + upcomingAppointments.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex items-center"><AlertCircle className="h-6 w-6 text-yellow-500" /><div className="ml-4"><p className="text-sm text-gray-600">Pending</p><p className="text-xl font-bold">{pendingAppointments.length}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex items-center"><CheckCircle className="h-6 w-6 text-green-500" /><div className="ml-4"><p className="text-sm text-gray-600">This Week</p><p className="text-xl font-bold">0</p></div></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex items-center"><MessageSquare className="h-6 w-6 text-blue-600" /><div className="ml-4"><p className="text-sm text-gray-600">New Messages</p><p className="text-xl font-bold">{recentMessages.length}</p></div></div></CardContent></Card>
        </div>

        {/* Pending Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-yellow-500" /> Pending Appointment Requests</CardTitle>
                <CardDescription>Review and approve student appointment requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingAppointments.map((appt) => (
                  <div key={appt._id} className="p-4 border rounded-md bg-yellow-50 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{appt.student?.name}</p>
                      <p className="text-sm text-gray-600">{appt.subject}</p>
                      <p className="text-sm text-gray-500">{appt.date} at {appt.time}</p>
                      <p className="text-sm italic mt-1 text-gray-700">"{appt.message}"</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(appt._id)}>Approve</Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white" onClick={() => handleReject(appt._id)}>Reject</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ✅ Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                
                <Link to="/teacher/appointments">
                  <Button className="w-full" variant="outline"><Eye className="mr-2 h-4 w-4" /> View All Appointments</Button>
                </Link>
               
                
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-blue-500" /> Recent Messages from Students</CardTitle>
              <CardDescription>Click to view full conversation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMessages.length === 0 ? (
                <p className="text-sm text-gray-500">No messages found.</p>
              ) : recentMessages.map((msg) => (
                <div key={msg._id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-900">{msg.student?.name}</h4>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{msg.message}</p>
                  <Link to={`/teacher/messages/${msg.student._id}`} state={{ name: msg.student.name }}>
                    <Button variant="outline" className="mt-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">View</Button>
                  </Link>
                </div>

              ))}
            </CardContent>
          </Card>
        </div>
        {/* Upcoming Appointments */}
<div className="mt-10">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-green-500" />
        Upcoming Appointments
      </CardTitle>
      <CardDescription>These are your confirmed upcoming appointments</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {upcomingAppointments.length === 0 ? (
        <p className="text-sm text-gray-500">No upcoming appointments scheduled.</p>
      ) : (
        upcomingAppointments.map((appt) => (
          <div key={appt._id} className="p-4 border rounded-md bg-green-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{appt.student?.name}</p>
                <p className="text-sm text-gray-600">{appt.subject}</p>
                <p className="text-sm text-gray-500">
                  {appt.date} at {appt.time}
                </p>
                {appt.message && (
                  <p className="text-sm italic mt-1 text-gray-700">"{appt.message}"</p>
                )}
              </div>
              <Badge className="bg-green-100 text-green-700">Confirmed</Badge>
            </div>
          </div>
        ))
      )}
    </CardContent>
  </Card>
</div>

      </main>
    </div>
  );
}
