import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import toast from 'react-hot-toast'
import { Home } from 'lucide-react'
import { deleteAccount } from '../api/auth'

export default function Profile(){
  const [form, setForm] = useState(()=>{
    try { const u = JSON.parse(localStorage.getItem('user')||'{}'); return { full_name: u?.full_name||'', phone: u?.phone||'', email: u?.email||'' } } catch { return { full_name: '', phone: '', email: '' } }
  })
  const [saving, setSaving] = useState(false)

  const onChange = (e)=> setForm(prev=>({ ...prev, [e.target.name]: e.target.value }))

  const onSave = async ()=>{
    setSaving(true)
    try{
      const res = await api.put('/api/auth/profile', { full_name: form.full_name, phone: form.phone })
      const user = { ...(JSON.parse(localStorage.getItem('user')||'{}')), full_name: res.data.user.full_name, phone: res.data.user.phone }
      localStorage.setItem('user', JSON.stringify(user))
      toast.success('Profile updated')
    }catch(e){
      toast.error(e?.message||'Failed to update')
    }finally{ setSaving(false) }
  }

  const onDelete = async ()=>{
    if (!confirm('Permanently delete your account?')) return
    try{ await deleteAccount(); localStorage.clear(); window.location.href='/' }catch{ toast.error('Failed to delete account') }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <Link to="/" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <Home className="h-4 w-4" /> Home
          </Link>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input name="full_name" value={form.full_name} onChange={onChange} className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={onChange} className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input name="email" value={form.email} disabled className="w-full p-3 border rounded-lg bg-gray-100" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button disabled={saving} onClick={onSave} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60">{saving? 'Saving...':'Save Changes'}</button>
            <button onClick={onDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  )
}


