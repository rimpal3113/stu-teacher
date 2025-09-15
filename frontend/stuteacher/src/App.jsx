import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider } from "./contexts/AuthContext"

// Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import StudentDashboard from "./pages/student/Dashboard"
import TeacherDashboard from "./pages/teacher/Dashboard"
import AdminDashboard from "./pages/admin/Dashboard"
import BookAppointment from "./pages/student/BookAppointment"
import TeacherManagement from "./pages/admin/TeacherManagement"
import AddTeacher from "./pages/admin/AddTeacher"

// Components
import ProtectedRoute from "./components/ProtectedRoute"

// Styles
import "./styles/globals.css"
import AboutUs from "./pages/AboutUs"
import Features from "./pages/Features"
import Contact from "./pages/Contact"
import HelpCenter from "./pages/HelpCenter"
import FAQ from "./pages/FAQ"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import EditTeacher from "./pages/admin/EditTeacher"

import StudentMessages from "./pages/student/StudentMessages"
import AdminAppointments from "./pages/admin/AdminAppointments"
import TeacherMessages from "./pages/teacher/TeacherMessages"
import TeacherAppointments from "./pages/teacher/TeacherAppointments"


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
               <Route path="/aboutus" element={<AboutUs />} />
               <Route path="/features" element={<Features />} /> 
               <Route path="/contact" element={<Contact />} />
               <Route path="/help" element={<HelpCenter />} />
               <Route path="/faq" element={<FAQ/>} />
               <Route path="/privacy" element={<PrivacyPolicy />} />
               <Route path="/admin/edit-teacher/:teacherId" element={<EditTeacher />} />
             <Route path="/student/book/:teacherId" element={<BookAppointment />} />

              <Route path="/teacher/appointments" element={<TeacherAppointments/>} />
<Route path="/student/message/:teacherId" element={<StudentMessages />} />
<Route path="/admin/appointments" element={<AdminAppointments />} />

<Route path="/teacher/messages/:studentId" element={<TeacherMessages />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
             

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute role="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/book-appointment/:teacherId"
                element={
                  <ProtectedRoute role="student">
                    <BookAppointment />
                  </ProtectedRoute>
                }
              />

              {/* Teacher Routes */}
              <Route
                path="/teacher/dashboard"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/teachers"
                element={
                  <ProtectedRoute role="admin">
                    <TeacherManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/add-teacher"
                element={
                  <ProtectedRoute role="admin">
                    <AddTeacher />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<div className="text-center py-20">Page Not Found</div>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
