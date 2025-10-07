import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Hash, Lock } from 'lucide-react';
import { resetPassword } from '../api/auth';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setErr(''); setMsg('');
    try { const res = await resetPassword({ email, otp, new_password: password }); setMsg(res.message || 'Password reset.'); setTimeout(()=>navigate('/login'), 800); }
    catch (e) { setErr(e.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset Password</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {err && <div className="text-red-600 text-sm">{err}</div>}
          {msg && <div className="text-green-700 text-sm">{msg}</div>}
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="Enter OTP" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="New password" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-60">{loading ? 'Resetting…' : 'Reset Password'}</button>
        </form>
      </div>
    </div>
  );
}


