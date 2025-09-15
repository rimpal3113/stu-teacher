"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select"
import { Textarea } from "../../components/ui/Textarea"
import { BookOpen, ArrowLeft, UserPlus, Save } from "lucide-react"

export default function AddTeacher() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    subject: "",
    bio: "",
    qualification: "",
    experience: "",
    status: "active",
     password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Economics",
    "Psychology",
    "Engineering",
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    // Debug: log what will be sent
    console.log("Submitting:", formData)
    try {
      const token = localStorage.getItem("token"); // or wherever you store your JWT
      const response = await fetch("http://localhost:5000/api/admin/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
     if (response.ok) {
  alert("Teacher added successfully!")
  navigate("/admin/teachers")
} else {
  if (data.message === "Access denied. No user role found.") {
    setError("Access denied. No user role found. Please login as an admin.");
  } else {
    setError(data.message || "Failed to add teacher");
  }
}
    } catch (err) {
      setError("Server error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin/teachers">
                <Button
                  variant="outline"
                  className="bg-white text-[#2B59C3] border-[#2B59C3] hover:bg-[#2B59C3] hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Teachers
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-[#2B59C3]" />
                <span className="text-xl font-bold text-gray-900">Add New Teacher</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-[#2B59C3]" />
              Teacher Information
            </CardTitle>
            <CardDescription>Fill in the details to add a new teacher to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-600 font-medium">{error}</div>
              )}
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="focus:ring-[#2B59C3] focus:border-[#2B59C3]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="focus:ring-[#2B59C3] focus:border-[#2B59C3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="focus:ring-[#2B59C3] focus:border-[#2B59C3]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="focus:ring-[#2B59C3] focus:border-[#2B59C3]"
                  />
                </div>
                <div className="space-y-2">
  <Label htmlFor="password">Password *</Label>
  <Input
    id="password"
    name="password"
    type="password"
    placeholder="Set a password for the teacher"
    value={formData.password}
    onChange={handleChange}
    required
    className="focus:ring-[#2B59C3] focus:border-[#2B59C3]"
  />
</div>

              </div>

              {/* Academic Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger className="focus:ring-[#2B59C3] focus:border-[#2B59C3]">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Specialization *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="e.g., Calculus, Algebra, Statistics"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="focus:ring-[#2B59C3] focus:border-[#2B59C3]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Highest Qualification *</Label>
                    <Select
                      value={formData.qualification}
                      onValueChange={(value) => setFormData({ ...formData, qualification: value })}
                    >
                      <SelectTrigger className="focus:ring-[#2B59C3] focus:border-[#2B59C3]">
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">Ph.D.</SelectItem>
                        <SelectItem value="postdoc">Post-Doctorate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => setFormData({ ...formData, experience: value })}
                    >
                      <SelectTrigger className="focus:ring-[#2B59C3] focus:border-[#2B59C3]">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="2-5">2-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="11-15">11-15 years</SelectItem>
                        <SelectItem value="16+">16+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Bio and Status */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio/Description</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Brief description about the teacher's background and expertise"
                      value={formData.bio}
                      onChange={handleChange}
                      className="focus:ring-[#2B59C3] focus:border-[#2B59C3]"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Initial Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="focus:ring-[#2B59C3] focus:border-[#2B59C3]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending Approval</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6 border-t">
                <Button
                  type="submit"
                  className="flex-1 bg-[#2B59C3] hover:bg-[#1e4a9f] text-white"
                  disabled={
                    loading ||
                    !formData.firstName ||
                    !formData.lastName ||
                    !formData.email ||
                    !formData.phone ||
                    !formData.department ||
                    !formData.subject ||
                    !formData.qualification ||
                    !formData.experience
                  }
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Adding..." : "Add Teacher"}
                </Button>
                <Link to="/admin/teachers">
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
  )
}