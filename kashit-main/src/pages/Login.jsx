import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { loginUser } from "../api/auth";
import { getAddresses } from "../api/addresses";

// Using real backend API from src/api/auth

export function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Kash.It</h1>
      <p className="mb-8 text-lg text-white/90 text-center">
        The best place to shop groceries online with IoT-powered experience
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export function Login({ setUser }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { access_token, user } = await loginUser(formData);
      localStorage.setItem("accessToken", access_token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (typeof setUser === 'function' && user) setUser(user);
      toast.success("Login successful!");
      // Decide redirect based on address presence
      try {
        const addresses = await getAddresses();
        const hasAny = Array.isArray(addresses) && addresses.length > 0;
        setTimeout(() => navigate(hasAny ? "/" : "/location-setup"), 600);
      } catch {
        setTimeout(() => navigate("/location-setup"), 600);
      }
    } catch (err) {
      const msg = err?.message || "Invalid credentials";
      if (msg.toLowerCase().includes("verify")) {
        toast.error("Please verify your email first. Redirecting to OTP…");
        setTimeout(() => navigate("/verify-otp", { state: { email: formData.email } }), 800);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 px-4">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Link>

        <h2 className="text-3xl font-bold text-purple-700 text-center">
          Login to Kash.It
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Enter your credentials to continue
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-purple-700/70 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>

          <div className="text-center mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-purple-700 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      toast.success("Registered successfully! Redirecting to OTP...");
      setTimeout(() => navigate("/verify-otp"), 1500);
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 px-4">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Link>

        <h2 className="text-3xl font-bold text-purple-700 text-center">
          Register to Kash.It
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Create your account to start shopping
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-purple-700/70 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>

          <div className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-purple-700 hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
