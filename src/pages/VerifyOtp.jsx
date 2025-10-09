import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { verifyOtp, resendOtp } from '../api/auth';
import { ArrowLeft, Mail, Hash, RotateCcw } from 'lucide-react';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location?.state?.email || '';
  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await verifyOtp({ email, otp });
      setSuccess('Email verified successfully. You can now sign in.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.message || 'Verification failed');
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verify your email</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-700 text-sm">{success}</div>}
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="Enter 6-digit OTP" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500" required />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-60">{loading ? 'Verifying…' : 'Verify'}</button>
            <button type="button" disabled={resending} onClick={async ()=>{ setResending(true); setError(''); setSuccess(''); try { await resendOtp({ email }); setSuccess('OTP resent. Check your email.'); } catch(e){ setError(e.message||'Failed to resend'); } finally { setResending(false); } }} className="px-4 py-3 rounded-md bg-white text-green-700 border border-green-600 font-medium hover:bg-green-50 disabled:opacity-60 inline-flex items-center gap-2">
              <RotateCcw className="h-4 w-4" /> Resend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


