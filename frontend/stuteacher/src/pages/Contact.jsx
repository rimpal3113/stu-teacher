import { BookOpen, Mail, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"

export default function Contact() {
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

      {/* Contact Section */}
      <section className="bg-gradient-to-br from-[#2B59C3] to-[#1e4a9f] text-white py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Have questions or need support? Reach out to us!
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h2>
            <div className="flex flex-col md:flex-row md:justify-center md:space-x-16 space-y-8 md:space-y-0">
              <div className="flex flex-col items-center">
                <Mail className="h-8 w-8 text-[#2B59C3] mb-2" />
                <span className="text-gray-700 font-medium">Email</span>
                <a href="mailto:thakorrimpal30@gmail.com" className="text-[#2B59C3] hover:underline">
                  thakorrimpal30@gmail.com
                </a>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="h-8 w-8 text-[#2B59C3] mb-2" />
                <span className="text-gray-700 font-medium">Phone</span>
                <a href="tel:+918488904795" className="text-[#2B59C3] hover:underline">
                  +91 8488904795
                </a>
              </div>
            </div>
            <div className="mt-10 text-center text-gray-600">
              Or fill out our <span className="font-semibold">Help Center</span> or <span className="font-semibold">FAQ</span> for more information.
            </div>
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