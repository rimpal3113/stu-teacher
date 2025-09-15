"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/Input"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avtar"
import {
  BookOpen,
  Users,
  UserPlus,
  GraduationCap,
  Shield,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const { user: contextUser, logout } = useAuth()
  const [user, setUser] = useState(contextUser)
  const navigate = useNavigate()

  const [teachers, setTeachers] = useState([])
  const [pendingRegistrations, setPendingRegistrations] = useState([])
  const [systemStats, setSystemStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalAppointments: 0,
    pendingApprovals: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!contextUser) {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        navigate("/login")
      }
    } else {
      setUser(contextUser)
    }
  }, [contextUser, navigate])

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/login")
    }
  }, [user, navigate])

 useEffect(() => {
  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.warn("⚠️ No token found in localStorage")
        setError("No token. Please login again.")
        return
      }

      // 🔍 Fetch Teachers
      const resTeachers = await fetch("http://localhost:5000/api/admin/teachers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      let teachersData;
      if (resTeachers.headers.get("content-type")?.includes("application/json")) {
        teachersData = await resTeachers.json();
      } else {
        const text = await resTeachers.text();
        throw new Error("Teachers API Non-JSON response: " + text);
      }
      console.log("📦 Teachers response:", resTeachers.status, teachersData)
      if (resTeachers.ok) {
        setTeachers(teachersData)
      } else {
        setError(teachersData.message || "Failed to load teachers")
      }

      // 🔍 Fetch Pending Registrations
    const resPending = await fetch("http://localhost:5000/api/admin/pending-registrations", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const pendingData = await resPending.json();
        if (resPending.ok) setPendingRegistrations(pendingData);

      // 🔍 Fetch System Stats
      const resStats = await fetch("http://localhost:5000/api/admin/system-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      let statsData;
      if (resStats.headers.get("content-type")?.includes("application/json")) {
        statsData = await resStats.json();
      } else {
        const text = await resStats.text();
        throw new Error("System Stats API Non-JSON response: " + text);
      }
      console.log("📊 System stats:", resStats.status, statsData)
      if (resStats.ok) {
        setSystemStats(statsData)
      }
    } catch (err) {
      console.error("❌ Dashboard fetch error:", err)
      setError("Server error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  fetchDashboardData()
}, [])
  const handleApproveRegistration = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/pending-registrations/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.ok) setPendingRegistrations((prev) => prev.filter((r) => r._id !== id));
      else alert("Approval failed");
    } catch (err) {
      alert("Failed to approve registration");
    }
  };

 const handleRejectRegistration = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/pending-registrations/${id}/reject`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (res.ok) setPendingRegistrations((prev) => prev.filter((r) => r._id !== id));
      else alert("Rejection failed");
    } catch (err) {
      alert("Failed to reject registration");
    }
  };

 const handleDeleteTeacher = async (teacherId) => {
  try {
    const token = localStorage.getItem("token")
   const res = await fetch(`http://localhost:5000/api/admin/teachers/${teacherId}`, {
  method: "DELETE",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
})
    if (res.ok) {
      setTeachers((prev) => prev.filter((t) => t._id !== teacherId))
    } else {
      console.error("❌ Failed to delete teacher", await res.json())
      alert("Deletion failed")
    }
  } catch (err) {
    console.error("❌ Delete error:", err)
    alert("Failed to delete teacher")
  }
}
// ...existing code...

const handleUpdateTeacher = async (teacherId, updatedData) => {
  try {
    const token = localStorage.getItem("token")
    const res = await fetch(`/api/admin/teachers/${teacherId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
    if (res.ok) {
      const result = await res.json()
      setTeachers((prev) =>
        prev.map((t) => (t._id === teacherId ? result.teacher : t))
      )
      alert("Teacher updated successfully")
    } else {
      const errData = await res.json()
      alert(errData.message || "Update failed")
    }
  } catch (err) {
    alert("Failed to update teacher")
    console.error("❌ Update error:", err)
  }
}

// ...existing code...

  const filteredTeachers = teachers.filter((teacher) =>
    ((teacher.firstName + " " + teacher.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (!user) return null



return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-[#2B59C3]" />
              <span className="text-xl font-bold text-gray-900">EduConnect Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <Button
                variant="outline"
                className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-[#2B59C3]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalTeachers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalAppointments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.pendingApprovals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Teacher Registrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-yellow-500" />
                  Pending Teacher Registrations
                </CardTitle>
                <CardDescription>Review and approve new teacher registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRegistrations.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No pending registrations.</div>
                  ) : (
                    pendingRegistrations.map((registration) => (
                      <div key={registration._id} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={registration.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {registration.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{registration.name}</h3>
                              <p className="text-sm text-gray-600">{registration.email}</p>
                              <p className="text-sm text-gray-500">
                                {registration.department} - {registration.subject}
                              </p>
                              <p className="text-xs text-gray-400">Applied on {registration.registrationDate}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApproveRegistration(registration._id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                              onClick={() => handleRejectRegistration(registration._id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Teacher Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-[#2B59C3]" />
                    Teacher Management
                  </div>
                  <Link to="/admin/add-teacher">
                    <Button className="bg-[#2B59C3] hover:bg-[#1e4a9f] text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Teacher
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>Manage existing teachers and their information</CardDescription>
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

                  {loading ? (
                    <div className="text-center text-gray-500 py-8">Loading teachers...</div>
                  ) : error ? (
                    <div className="text-center text-red-500 py-8">{error}</div>
                  ) : (
                   <div className="space-y-3 max-h-96 overflow-y-auto">
  {filteredTeachers.length === 0 ? (
    <div className="text-center text-gray-500 py-8">No teachers found.</div>
  ) : (
    filteredTeachers.map((teacher) => (
      <div
        key={teacher._id}
        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
      >
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={teacher.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {(teacher.firstName?.[0] || "") + (teacher.lastName?.[0] || "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </h3>
            <p className="text-sm text-gray-600">{teacher.email}</p>
            <p className="text-sm text-gray-500">
              {teacher.department} - {teacher.subject}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge
                className={
                  teacher.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {teacher.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {/* Edit Button */}
          <Link to={`/admin/edit-teacher/${teacher._id}`}>
            <Button
              size="sm"
              variant="outline"
              className="bg-white text-[#2B59C3] border-[#2B59C3] hover:bg-[#2B59C3] hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          {/* Delete Button */}
          <Button
            size="sm"
            variant="outline"
            className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
            onClick={() => handleDeleteTeacher(teacher._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ))
  )}
</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/admin/add-teacher">
                  <Button className="w-full bg-[#2B59C3] hover:bg-[#1e4a9f] text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Teacher
                  </Button>
                </Link>
                <Link to="/admin/teachers">
                  <Button
                    variant="outline"
                    className="w-full bg-white text-[#2B59C3] border-[#2B59C3] hover:bg-[#2B59C3] hover:text-white"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Teachers
                  </Button>
                </Link>
                
               
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="text-gray-900">New teacher registered</p>
                      <p className="text-gray-500 text-xs">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="text-gray-900">Student registration approved</p>
                      <p className="text-gray-500 text-xs">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="text-sm">
                      <p className="text-gray-900">System maintenance scheduled</p>
                      <p className="text-gray-500 text-xs">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Server Status</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Database</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Email Service</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Storage</span>
                    <Badge className="bg-yellow-100 text-yellow-800">75% Used</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}