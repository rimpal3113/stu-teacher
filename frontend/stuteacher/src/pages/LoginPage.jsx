"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select"
import { Checkbox } from "../components/ui/checkbox"
import { BookOpen, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  })

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { email, password, role } = formData;

  if (!email || !password || !role) {
    alert("Please fill in all fields including role.");
    return;
  }

  try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ Store token & user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect based on role
      const userRole = data.user.role.toLowerCase();
      if (userRole === "student") navigate("/student/dashboard");
      else if (userRole === "teacher") navigate("/teacher/dashboard");
      else if (userRole === "admin") navigate("/admin/dashboard");
      else alert("Unknown user role");

    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred. Please try again.");
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B59C3] to-[#1e4a9f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-blue-100 transition-colors">
            <BookOpen className="h-8 w-8" />
            <span className="text-2xl font-bold">EduConnect</span>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">Sign in to your account to continue</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Login As
                </Label>
                <Select value={formData.role} onValueChange={handleRoleChange} required disabled={isLoading}>
                  <SelectTrigger className="h-11 w-full border border-gray-300 rounded-md bg-white text-sm focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 border border-gray-200 shadow-md rounded-md">
                    <SelectItem
                      value="student"
                      className="cursor-pointer hover:bg-blue-50 px-3 py-2 text-sm text-gray-800"
                    >
                      Student
                    </SelectItem>
                    <SelectItem
                      value="teacher"
                      className="cursor-pointer hover:bg-blue-50 px-3 py-2 text-sm text-gray-800"
                    >
                      Teacher
                    </SelectItem>
                    <SelectItem
                      value="admin"
                      className="cursor-pointer hover:bg-blue-50 px-3 py-2 text-sm text-gray-800"
                    >
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  
                </div>
                
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                disabled={!formData.email || !formData.password || !formData.role || isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {"Don't have an account? "}
                <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Privacy */}
        <div className="mt-6 text-center">
          <p className="text-xs text-blue-100">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-white transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
