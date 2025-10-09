import { Link } from 'react-router-dom';
import { Package, Heart, MapPin, Headset, LogOut, Home } from 'lucide-react';

export default function UserPage() {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{user?.full_name ? `Hello, ${user.full_name}` : 'Your Account'}</h1>
          <Link to="/" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <Home className="h-4 w-4" /> Home
          </Link>
        </div>
        {user?.email && (
          <div className="mb-6 text-gray-700">Signed in as <span className="font-medium">{user.email}</span></div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/orders" className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex items-center gap-3">
            <Package className="text-green-600" /> <span className="font-medium text-gray-800">Your Orders</span>
          </Link>
          <Link to="/wishlist" className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex items-center gap-3">
            <Heart className="text-green-600" /> <span className="font-medium text-gray-800">Your Wishlist</span>
          </Link>
          <Link to="/addresses" className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex items-center gap-3">
            <MapPin className="text-green-600" /> <span className="font-medium text-gray-800">Your Addresses</span>
          </Link>
          <Link to="/profile" className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex items-center gap-3">
            <Home className="text-green-600" /> <span className="font-medium text-gray-800">My Profile</span>
          </Link>
          <Link to="/support" className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex items-center gap-3">
            <Headset className="text-green-600" /> <span className="font-medium text-gray-800">Customer Support</span>
          </Link>
          <Link to="/policies" className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex items-center gap-3">
            <Home className="text-green-600" /> <span className="font-medium text-gray-800">Policies</span>
          </Link>
          <button onClick={()=>{ localStorage.removeItem('accessToken'); localStorage.removeItem('user'); window.location.href='/'; }} className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex items-center gap-3">
            <LogOut className="text-green-600" /> <span className="font-medium text-gray-800">Logout</span>
          </button>
        </div>

        {/* Bottom sections removed as requested; use tiles above to navigate to pages */}
      </div>
    </div>
  );
}


