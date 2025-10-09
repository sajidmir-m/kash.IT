import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function FeminineHygiene() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Feminine Hygiene</h1>
            <Link to="/cart" className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700">
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Coming Soon</h3>
            <p className="text-gray-600 mb-6">Products for Feminine Hygiene will be available soon.</p>
            <Link to="/" className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}