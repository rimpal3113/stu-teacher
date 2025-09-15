"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Badge } from "../../components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avtar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select"
import {
  BookOpen,
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  Download,
} from "lucide-react"

export default function TeacherManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [teachers, setTeachers] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch teachers from backend
 useEffect(() => {
  const fetchTeachers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/teachers", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      const data = await res.json()
      if (res.ok) {
        setTeachers(data)
        const uniqueDepartments = [
          ...new Set(data.map((t) => t.department).filter(Boolean)),
        ]
        setDepartments(uniqueDepartments)
      } else {
        setError(data.message || "Failed to load teachers")
      }
    } catch (err) {
      setError("Server error")
    } finally {
      setLoading(false)
    }
  }
  fetchTeachers()
}, [])

  const handleDeleteTeacher = async (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
       const res = await fetch(`/api/admin/teachers/${teacherId}`, {
  method: "DELETE",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
})
        if (res.ok) {
          setTeachers((prev) => prev.filter((t) => t._id !== teacherId))
        }
      } catch (err) {
        alert("Failed to delete teacher")
      }
    }
  }

  const handleStatusChange = async (teacherId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/teachers/${teacherId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setTeachers((prev) =>
          prev.map((t) =>
            t._id === teacherId ? { ...t, status: newStatus } : t
          )
        )
      }
    } catch (err) {
      alert("Failed to update status")
    }
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const name = `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim()
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.department || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.subject || "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || teacher.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || teacher.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard">
                <Button
                  variant="outline"
                  className="bg-white text-[#2B59C3] border-[#2B59C3] hover:bg-[#2B59C3] hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-[#2B59C3]" />
                <span className="text-xl font-bold text-gray-900">Teacher Management</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-[#2B59C3] hover:bg-[#1e4a9f] text-white">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Link to="/admin/add-teacher">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teacher
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-[#2B59C3]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teachers.filter((t) => t.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teachers.filter((t) => t.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-[#2B59C3]" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus:ring-[#2B59C3] focus:border-[#2B59C3]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="focus:ring-[#2B59C3] focus:border-[#2B59C3]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="focus:ring-[#2B59C3] focus:border-[#2B59C3]">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setDepartmentFilter("all")
                }}
                className="bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Teachers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-[#2B59C3]" />
                Teachers List ({filteredTeachers.length})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading teachers...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : (
              <div className="space-y-4">
                {filteredTeachers.map((teacher) => (
                  <div
                    key={teacher._id}
                    className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={teacher.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {(teacher.firstName?.[0] || "") + (teacher.lastName?.[0] || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {teacher.firstName} {teacher.lastName}
                          </h3>
                          <Badge className={getStatusColor(teacher.status)}>{teacher.status}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {teacher.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {teacher.phone}
                          </div>
                          <div>
                            <strong>Department:</strong> {teacher.department}
                          </div>
                          <div>
                            <strong>Joined:</strong> {teacher.joinDate}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <strong>Subjects:</strong> {teacher.subject}
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-gray-600">
                            <strong>Appointments:</strong> {teacher.totalAppointments}
                          </span>
                          <span className="text-gray-600">
                            <strong>Rating:</strong> ⭐ {teacher.rating}/5.0
                          </span>
                          <span className="text-gray-600">
                            <strong>Last Active:</strong> {teacher.lastActive}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <Link to={`/admin/teachers/${teacher._id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white text-[#2B59C3] border-[#2B59C3] hover:bg-[#2B59C3] hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/admin/edit-teacher/${teacher._id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          onClick={() => handleDeleteTeacher(teacher._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Select value={teacher.status} onValueChange={(value) => handleStatusChange(teacher._id, value)}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredTeachers.length === 0 && !loading && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or add a new teacher.</p>
                <Link to="/admin/add-teacher">
                  <Button className="mt-4 bg-[#2B59C3] hover:bg-[#1e4a9f] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Teacher
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}