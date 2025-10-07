import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listOrders } from '../api/orders'
import { Loader2, Home } from 'lucide-react'

export default function Orders(){
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

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
            {orders.map(o=> (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


