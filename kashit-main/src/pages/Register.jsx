import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react';
import { registerUser } from '../api/auth';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await registerUser(form);
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input name="full_name" placeholder="Full name" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" value={form.full_name} onChange={onChange} />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input name="email" type="email" placeholder="Email" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" value={form.email} onChange={onChange} required />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input name="phone" placeholder="Phone (optional)" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" value={form.phone} onChange={onChange} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input name="password" type="password" placeholder="Password" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" value={form.password} onChange={onChange} required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-60">{loading ? 'Creating…' : 'Create account'}</button>
          <div className="text-center text-sm">
            Already have an account? <Link to="/login" className="text-green-600 hover:text-green-700">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}


