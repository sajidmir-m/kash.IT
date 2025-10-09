import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listOrders } from '../api/orders'
import { api } from '../api/client'
import { Loader2, Home, Filter, Clock, CheckCircle, Truck, Package, XCircle } from 'lucide-react'

export default function Orders(){
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(()=>{
    const token = localStorage.getItem('accessToken')
    if(!token){ navigate('/login'); return }
    ;(async()=>{
      try{
        const data = await listOrders()
        setOrders(data)
      }finally{ setLoading(false) }
    })()
  },[])

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      const res = await api.delete(`/api/orders/${orderId}`)
      if (res.status === 200) {
        setOrders(prev => prev.filter(o => o.id !== orderId))
      }
    } catch (e) {
      alert(e?.message || 'Failed to delete order')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
          <Link to="/" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <Home className="h-4 w-4"/> Home
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-gray-600"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-700">No orders yet.</div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg shadow flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Filter className="h-4 w-4" /> Filter by status:
                <select value={filter} onChange={e=>setFilter(e.target.value)} className="ml-2 border rounded px-2 py-1 text-sm">
                  <option value="all">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {orders.filter(o=>o.status==='Pending').length}</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> {orders.filter(o=>o.status==='Confirmed').length}</span>
                <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> {orders.filter(o=>o.status==='Shipped').length}</span>
                <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {orders.filter(o=>o.status==='Delivered').length}</span>
                <span className="flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> {orders.filter(o=>o.status==='Cancelled').length}</span>
              </div>
            </div>
            {orders.filter(o => filter==='all' ? true : o.status===filter).map(o=> (
              <div key={o.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div className="text-gray-900 font-medium">Order #{o.id}</div>
                  <div className="text-sm text-gray-600">{new Date(o.created_at).toLocaleString()}</div>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-700">
                  <span>Total: ₹{o.total_amount?.toFixed?.(2) ?? o.total_amount}</span>
                  <span>Discount: ₹{o.discount_amount?.toFixed?.(2) ?? o.discount_amount}</span>
                  <span>Final: <span className="font-semibold">₹{o.final_amount?.toFixed?.(2) ?? o.final_amount}</span></span>
                  <span>Status: {o.status}</span>
                  <span>Payment: {o.payment_status}</span>
                  <span>Items: {o.items_count}</span>
                </div>
                {['Delivered','Cancelled'].includes(o.status) && (
                  <div className="mt-3">
                    <button onClick={()=>deleteOrder(o.id)} className="px-3 py-1.5 bg-red-50 text-red-700 rounded text-xs hover:bg-red-100">
                      Delete Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


