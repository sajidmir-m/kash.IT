import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function Support(){
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Customer Support</h1>
          <Link to="/" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <Home className="h-4 w-4" /> Home
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow space-y-2 text-gray-800">
          <p>For any assistance, contact us:</p>
          <p>Email: <a className="text-green-700 underline" href="mailto:kashit.kashmir@gmail.com">kashit.kashmir@gmail.com</a></p>
          <p>Phone: <a className="text-green-700" href="tel:+919149559393">+91 91495 59393</a></p>
        </div>
      </div>
    </div>
  )
}


