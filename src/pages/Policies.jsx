import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function Policies(){
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Policies</h1>
          <Link to="/" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <Home className="h-4 w-4" /> Home
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow space-y-3 text-gray-800">
          <p>• Terms of Service</p>
          <p>• Privacy Policy</p>
          <p>• Return & Refund Policy</p>
          <p className="text-sm text-gray-600">Detailed content can be added here or linked to external pages.</p>
        </div>
      </div>
    </div>
  )
}


