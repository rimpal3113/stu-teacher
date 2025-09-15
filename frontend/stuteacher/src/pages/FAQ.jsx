import { BookOpen, HelpCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"

export default function FAQ() {
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

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-[#2B59C3] to-[#1e4a9f] text-white py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-white" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Find answers to the most common questions about EduConnect.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8">
            <ul className="space-y-6">
              <li>
                <h3 className="font-semibold text-gray-800">What is EduConnect?</h3>
                <p className="text-gray-600">EduConnect is a platform that connects students and teachers, making it easy to book appointments, communicate, and manage educational activities.</p>
              </li>
              <li>
                <h3 className="font-semibold text-gray-800">How do I create an account?</h3>
                <p className="text-gray-600">Click the "Register" button at the top right and fill out the registration form as a student or teacher.</p>
              </li>
              <li>
                <h3 className="font-semibold text-gray-800">How do I reset my password?</h3>
                <p className="text-gray-600">On the login page, click "Forgot Password?" and follow the instructions to reset your password.</p>
              </li>
              <li>
                <h3 className="font-semibold text-gray-800">How can I contact support?</h3>
                <p className="text-gray-600">You can email us at <a href="mailto:thakorrimpal30@gmail.com" className="text-[#2B59C3] hover:underline">thakorrimpal30@gmail.com</a> or visit our <Link to="/contact" className="text-[#2B59C3] hover:underline">Contact</Link> page.</p>
              </li>
              <li>
                <h3 className="font-semibold text-gray-800">Where can I find more help?</h3>
                <p className="text-gray-600">Visit our <Link to="/help" className="text-[#2B59C3] hover:underline">Help Center</Link> for more resources and support.</p>
              </li>
            </ul>
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
                <li><Link to="/about" className="hover:text-white">About</Link></li>
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