// src/components/Promise.jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Promise() {
  return (
    <section
      className="relative w-full max-w-[1200px] mx-auto min-h-[400px] flex items-center mb-8 
                 rounded-b-[20px] md:rounded-b-[50px] overflow-hidden shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #16a34a 100%)'
      }}
    >
      <div className="container mx-auto px-4">
        <div
          className="max-w-2xl animate-fadeIn"
        >
          <h1
            className="text-white font-extrabold leading-tight tracking-tight relative 
                       text-5xl sm:text-6xl md:text-7xl drop-shadow-md"
          >
            10-Minute Delivery <br />
            <span className="text-white">in Srinagar</span>
            <span className="absolute -bottom-4 left-0 w-20 h-1 bg-white rounded"></span>
          </h1>

          <p
            className="mt-6 mb-8 max-w-2xl text-white text-lg md:text-xl font-normal 
                       leading-relaxed drop-shadow-sm"
          >
            Get groceries, fresh produce, and daily essentials delivered to your
            doorstep in minutes. Experience the fastest delivery in the valley.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="relative overflow-hidden group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all flex items-center"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">Shop Now</span>
              <ArrowRight className="ml-2 w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/kashmiri-specialties"
              className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold 
                         hover:border-green-400 hover:bg-white/10 transition-all"
            >
              Kashmiri Specialties
            </Link>
          </div>
        </div>
      </div>

      {/* Tailwind animation keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
          }
        `}
      </style>
    </section>
  );
}
