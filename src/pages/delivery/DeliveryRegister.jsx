import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'

export default function DeliveryRegister(){
  const nav = useNavigate()
  const [full_name, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setMessage('')
    try{
      setLoading(true)
      const { data } = await api.post('/api/delivery/register', { full_name, phone, email, password })
      setMessage('Registered successfully. Please wait for admin verification. You can login after approval.')
    }catch(e){ setError(e?.response?.data?.error || e.message || 'Registration failed') }
    finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold text-gray-900">Delivery Partner Registration</h1>
        {message && <div className="text-sm text-green-700 bg-green-50 p-2 rounded">{message}</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        <input className="w-full border rounded px-3 py-2" placeholder="Full name" value={full_name} onChange={e=>setFullName(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-green-600 text-white rounded px-3 py-2 hover:bg-green-700 disabled:opacity-50">{loading?'Registering...':'Register'}</button>
        <div className="text-sm text-gray-600">Already have an account? <Link to="/delivery-login" className="text-green-700">Login</Link></div>
      </form>
    </div>
  )
}


