import { useEffect, useRef } from "react"
import { BookOpen, Users, Shield, GraduationCap } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { Link } from "react-router-dom"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Features() {
  const featuresRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    if (featuresRef.current && cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      )
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-[#2B59C3]" />
              <span className="text-xl font-bold text-gray-900">EduConnect</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="bg-white text-[#2B59C3] border-[#2B59C3] hover:bg-[#2B59C3] hover:text-white"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#2B59C3] hover:bg-[#1e4a9f] text-white">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Hero Section */}
      <section className="bg-gradient-to-br from-[#2B59C3] to-[#1e4a9f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Platform Features</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover the powerful features that make EduConnect the best choice for students, teachers, and administrators.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Features for Everyone</h2>
            <p className="text-xl text-gray-600">
              Designed to meet the needs of students, teachers, and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {["Students", "Teachers", "Admins"].map((role, index) => (
              <Card
                key={role}
                className="border-2 hover:border-[#2B59C3] transition-colors"
                ref={(el) => (cardsRef.current[index] = el)}
              >
                <CardHeader className="text-center">
                  {role === "Students" && <GraduationCap className="h-12 w-12 text-[#2B59C3] mx-auto mb-4" />}
                  {role === "Teachers" && <Users className="h-12 w-12 text-[#2B59C3] mx-auto mb-4" />}
                  {role === "Admins" && <Shield className="h-12 w-12 text-[#2B59C3] mx-auto mb-4" />}
                  <CardTitle className="text-xl text-gray-900">For {role}</CardTitle>
                  <CardDescription>
                    {role === "Students" && "Easy booking and communication"}
                    {role === "Teachers" && "Manage appointments efficiently"}
                    {role === "Admins" && "Complete system management"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    {(role === "Students" && [
                      "Search and find teachers",
                      "Book appointments easily",
                      "Send messages to teachers",
                      "Track appointment status",
                    ]) ||
                      (role === "Teachers" && [
                        "Schedule availability",
                        "Approve/cancel appointments",
                        "View all appointments",
                        "Communicate with students",
                      ]) ||
                      (role === "Admins" && [
                        "Manage teachers",
                        "Approve registrations",
                        "System oversight",
                        "User management",
                      ])
                    .map((text, i) => (
                      <li key={i} className="flex items-center">
                        <div className="w-2 h-2 bg-[#2B59C3] rounded-full mr-3"></div>
                        {text}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-[#2B59C3]" />
                <span className="text-lg font-bold">EduConnect</span>
              </div>
              <p className="text-gray-400">Connecting students and teachers for better educational outcomes.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                 <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/aboutus" className="hover:text-white">About</Link></li>
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="text-gray-400 space-y-2">
                <p>thakorrimpal30@gmail.com</p>
                <p>+91 8488904795</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EduConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}