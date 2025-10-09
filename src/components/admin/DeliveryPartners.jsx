import { useEffect, useState } from 'react'
import { adminAPI } from '../../api/admin'
import { api } from '../../api/client'

export default function DeliveryPartners(){
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('pending')
  const [view, setView] = useState(null)

  useEffect(()=>{ fetchList() },[status])

  async function fetchList(){
    try{
      setLoading(true)
      const res = await adminAPI.getDeliveryPartners({ status })
      setPartners(res?.partners || [])
    }finally{ setLoading(false) }
  }

  async function update(id, body){
    const res = await adminAPI.updateDeliveryPartner(id, body)
    if(res?.message){ fetchList() }
  }

  async function remove(id){
    if(!window.confirm('Delete this partner?')) return
    const res = await adminAPI.deleteDeliveryPartner(id)
    if(res?.message){ fetchList() }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Delivery Partners</h3>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="border rounded px-2 py-1 text-sm">
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : partners.length===0 ? (
        <div className="text-gray-600">No delivery partners</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Verified</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map(p => (
                <tr key={p.id} className="border-t text-sm">
                  <td className="px-4 py-2">{p.full_name || '-'}</td>
                  <td className="px-4 py-2">{p.email}</td>
                  <td className="px-4 py-2">{p.phone || '-'}</td>
                  <td className="px-4 py-2">{p.is_verified ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">{p.is_active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={async()=>{
                      try{
                        const res = await api.get(`/api/admin/delivery-partners/${p.id}`)
                        setView(res?.data?.partner)
                      }catch(e){ /* ignore */ }
                    }} className="px-2 py-1 bg-gray-100 rounded text-xs">View</button>
                    {!p.is_verified && (
                      <button onClick={()=>update(p.id,{ is_verified: true, is_active: true })} className="px-2 py-1 bg-green-600 text-white rounded text-xs">Approve</button>
                    )}
                    {p.is_verified && p.is_active && (
                      <button onClick={()=>update(p.id,{ is_active: false })} className="px-2 py-1 bg-yellow-600 text-white rounded text-xs">Deactivate</button>
                    )}
                    {!p.is_active && (
                      <button onClick={()=>update(p.id,{ is_active: true })} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Activate</button>
                    )}
                    <button onClick={()=>remove(p.id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Delivery Partner Details</h3>
              <button onClick={()=>setView(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-900">{view.full_name || '-'}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-900">{view.email}</span></div>
              <div><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{view.phone || '-'}</span></div>
              <div><span className="text-gray-500">Verified:</span> <span className="font-medium text-gray-900">{view.is_verified ? 'Yes' : 'No'}</span></div>
              <div><span className="text-gray-500">Active:</span> <span className="font-medium text-gray-900">{view.is_active ? 'Yes' : 'No'}</span></div>
              <div><span className="text-gray-500">Created:</span> <span className="font-medium text-gray-900">{new Date(view.created_at).toLocaleString()}</span></div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Recent Deliveries</h4>
              {(!view.deliveries || view.deliveries.length===0) ? (
                <div className="text-sm text-gray-600">No recent deliveries</div>
              ) : (
                <div className="max-h-64 overflow-auto border rounded">
                  {view.deliveries.map(d => (
                    <div key={d.id} className="flex items-center justify-between px-3 py-2 border-b text-sm">
                      <div>
                        <div className="font-medium text-gray-900">Order #{d.id}</div>
                        <div className="text-gray-600">{d.customer?.name} • {d.address?.city || ''}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-700 capitalize">{d.delivery_status || d.status}</div>
                        <div className="text-gray-500">{new Date(d.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 text-right">
              <button onClick={()=>setView(null)} className="px-4 py-2 bg-gray-100 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


