import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Plus, Trash2, Home, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAddresses, deleteAddress, setDefaultAddress } from '../api/addresses'

export default function Addresses() {
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      navigate('/login')
      return
    }
    load()
  }, [])

  const load = async () => {
    try {
      const data = await getAddresses()
      setAddresses(data)
    } catch (e) {
      toast.error('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  const onSetDefault = async (id) => {
    try {
      await setDefaultAddress(id)
      toast.success('Default address updated')
      await load()
    } catch (e) {
      toast.error('Failed to update default')
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this address?')) return
    try {
      await deleteAddress(id)
      toast.success('Address deleted')
      await load()
    } catch (e) {
      toast.error('Failed to delete address')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Addresses</h1>
          <div className="flex gap-2">
            <Link to="/" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              <Home className="h-4 w-4" /> Home
            </Link>
            <Link to="/location-setup" className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              <Plus className="h-4 w-4" /> Add Address
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-gray-600"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>
        ) : addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map((a) => (
              <div key={a.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900">{a.address_line1}</h3>
                      {a.is_default && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Default</span>
                      )}
                    </div>
                    {a.address_line2 && (
                      <p className="text-gray-600 text-sm mb-1">{a.address_line2}</p>
                    )}
                    <p className="text-gray-600 text-sm">{a.city}, {a.state} - {a.postal_code}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!a.is_default && (
                      <button onClick={() => onSetDefault(a.id)} className="text-green-600 hover:text-green-700 p-1" title="Set as default">
                        <MapPin className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => onDelete(a.id)} className="text-red-600 hover:text-red-700 p-1" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-gray-600 mb-4">Add your first address to get started</p>
            <Link to="/location-setup" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">Add Address</Link>
          </div>
        )}
      </div>
    </div>
  )
}


