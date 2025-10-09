import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const apiBase = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://kashit-backend.onrender.com' : 'http://localhost:8000')

export default function DeliveryDashboard(){
  const nav = useNavigate()
  const [tab, setTab] = useState('available')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('deliveryToken')

  useEffect(()=>{
    if(!token){ nav('/delivery-login'); return }
    fetchOrders(tab)
  },[tab])

  async function fetchOrders(kind){
    try{
      setLoading(true)
      const url = kind==='available' ? `${apiBase}/api/delivery/orders?status=available` : `${apiBase}/api/delivery/orders`
      const res = await fetch(url,{ headers:{ Authorization: `Bearer ${token}` }})
      const data = await res.json()
      setOrders(data.orders||[])
    }finally{ setLoading(false) }
  }

  async function accept(orderId){
    const res = await fetch(`${apiBase}/api/delivery/orders/${orderId}/accept`,{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }})
    const data = await res.json()
    if(!res.ok){ alert(data.error||'Failed'); return }
    fetchOrders(tab)
  }

  async function complete(orderId){
    const res = await fetch(`${apiBase}/api/delivery/orders/${orderId}/complete`,{ method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }})
    const data = await res.json()
    if(!res.ok){ alert(data.error||'Failed'); return }
    fetchOrders(tab)
  }

  function logout(){
    localStorage.removeItem('deliveryToken')
    localStorage.removeItem('deliveryUser')
    nav('/delivery-login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
          <button onClick={logout} className="px-3 py-1.5 rounded bg-gray-100">Logout</button>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={()=>setTab('available')} className={`px-3 py-1.5 rounded ${tab==='available'?'bg-green-600 text-white':'bg-white'}`}>Available</button>
          <button onClick={()=>setTab('assigned')} className={`px-3 py-1.5 rounded ${tab==='assigned'?'bg-green-600 text-white':'bg-white'}`}>My Deliveries</button>
        </div>
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : orders.length===0 ? (
          <div className="text-gray-600">No orders</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map(o=> (
              <div key={o.id} className="bg-white rounded shadow p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Order #{o.id}</div>
                  <div className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString()}</div>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  <div>Customer: {o.customer_name} ({o.customer_phone || '-'})</div>
                  {o.address && (
                    <div>Address: {o.address.line1}{o.address.line2?`, ${o.address.line2}`:''}, {o.address.city}, {o.address.state} - {o.address.postal_code}</div>
                  )}
                  <div>Status: {o.delivery_status || o.status}</div>
                  <div className="mt-1">Items: {o.items.map(i=>`${i.name} x${i.qty}`).join(', ')}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  {tab==='available' ? (
                    <button onClick={()=>accept(o.id)} className="px-3 py-1.5 rounded bg-green-600 text-white">Accept</button>
                  ) : (
                    <button onClick={()=>complete(o.id)} className="px-3 py-1.5 rounded bg-green-600 text-white">Mark Delivered</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


