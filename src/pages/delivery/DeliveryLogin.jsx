import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../api/client'

export default function DeliveryLogin(){
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try{
      setLoading(true)
      const { data } = await api.post('/api/delivery/login', { email, password })
      localStorage.setItem('deliveryToken', data.access_token)
      localStorage.setItem('deliveryUser', JSON.stringify(data.partner))
      nav('/delivery/dashboard')
    }catch(e){ setError(e?.response?.data?.error || e.message || 'Login failed') }
    finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold text-gray-900">Delivery Partner Login</h1>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-green-600 text-white rounded px-3 py-2 hover:bg-green-700 disabled:opacity-50">{loading?'Logging in...':'Login'}</button>
        <div className="text-sm text-gray-600">New partner? <Link to="/delivery-register" className="text-green-700">Register</Link></div>
      </form>
    </div>
  )
}


