"use client";
import React, { useEffect, useState } from "react";
import { Calendar, Loader2, LogOut } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button"; // ✅ make sure you have button component
import { useAuth } from "../../contexts/AuthContext"; // ✅ your auth context

export default function TeacherAppointments() {
  const { user, logout } = useAuth(); // ✅ so we can show name + logout
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/teachers/appointments", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await res.json();
        // ✅ merge pending + upcoming so table shows both
        setAppointments([...(data.pending || []), ...(data.upcoming || [])]);
      } catch (err) {
        console.error("❌ Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

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
                Welcome, {user?.firstName || user?.name?.split(" ")[0] || "Teacher"}
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

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : appointments.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No appointments found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((a) => (
                    <TableRow key={a._id}>
                      <TableCell>{a.student?.name || a.student?.email || "Unknown"}</TableCell>
                      <TableCell>{a.subject}</TableCell>
                      <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
                      <TableCell>{a.timeSlot}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            a.priority === "high"
                              ? "destructive"
                              : a.priority === "normal"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {a.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            a.status === "pending"
                              ? "secondary"
                              : a.status === "confirmed"
                              ? "default"
                              : "outline"
                          }
                        >
                          {a.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
