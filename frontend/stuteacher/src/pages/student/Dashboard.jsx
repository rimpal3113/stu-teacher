"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avtar"
import {
  BookOpen,
  Search,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
} from "lucide-react"

export default function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [user, setUser] = useState(null)
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [recentMessages, setRecentMessages] = useState([])
  const [teachers, setTeachers] = useState([])
  const navigate = useNavigate()

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      navigate("/login")
    }
  }, [navigate])

  // ✅ Fetch appointments, messages & teachers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")

        // Fetch appointments + messages
        const res = await fetch("https://stbackend-pied.vercel.app/api/student/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        console.log("📌 Dashboard Response:", data)

        if (res.ok) {
          setUpcomingAppointments(data.appointments || data.upcoming || [])
          setRecentMessages(data.messages || [])
        }

        // Fetch teachers
        const resTeachers = await fetch("https://stbackend-pied.vercel.app/api/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const teachersData = await resTeachers.json()

        if (resTeachers.ok) {
          setTeachers(teachersData)
        }
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err)
      }
    }

    if (user) fetchData()
  }, [user])

  if (!user) return null

  // ✅ Helper for status icon & color
  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // ✅ Filter teachers by name, department, subject
  const filteredTeachers = teachers.filter(
    (teacher) =>
      (`${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.department || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.subject || "").toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-[#2B59C3]" />
              <span className="text-xl font-bold text-gray-900">EduConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user.firstName} {user.lastName}
              </span>
              <Button
                variant="outline"
                className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✅ Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-[#2B59C3]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {upcomingAppointments.filter((a) => a.status === "confirmed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {upcomingAppointments.filter((a) => a.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-[#2B59C3]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{recentMessages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-5 space-y-8">
            {/* Search Teachers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-[#2B59C3]" />
                  Find Teachers
                </CardTitle>
                <CardDescription>Search for teachers by name, department, or subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search teachers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 focus:ring-[#2B59C3] focus:border-[#2B59C3]"
                    />
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredTeachers.map((teacher) => (
                      <div
                        key={teacher._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={teacher.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {teacher.firstName?.[0]}
                              {teacher.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {teacher.firstName} {teacher.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">{teacher.department}</p>
                            <p className="text-sm text-gray-500">{teacher.subject}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm text-gray-600 ml-1">{teacher.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link to={`/student/book/${teacher._id}`}>
                            <Button className="bg-blue-600 text-white hover:bg-blue-700">Book</Button>
                          </Link>
                          <Link to={`/student/message/${teacher._id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white text-[#2B59C3] border-[#2B59C3] hover:bg-[#2B59C3] hover:text-white"
                            >
                              Message
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[#2B59C3]" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {appointment.teacher
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{appointment.teacher}</h3>
                          <p className="text-sm text-gray-600">{appointment.subject}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(appointment.status)}
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
