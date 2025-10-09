import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const OrderManagement = ({ initialFilter = 'all' }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(initialFilter);
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vendorToken');
      const response = await fetch('http://localhost:8000/api/vendor/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      toast.error('Error loading orders');
      console.error('Orders fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('vendorToken');
      const response = await fetch(`http://localhost:8000/api/vendor/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders(); // Refresh orders
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update order status');
      }
    } catch (error) {
      toast.error('Error updating order status');
      console.error('Order update error:', error);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    await updateOrderStatus(orderId, 'cancelled');
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('vendorToken');
      const res = await fetch(`http://localhost:8000/api/vendor/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete order');
      toast.success('Order deleted');
      fetchOrders();
    } catch (e) {
      toast.error(e?.message || 'Delete failed');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <button
          onClick={fetchOrders}
          className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Package className="h-5 w-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-xl font-bold text-gray-900">{stats.confirmed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Shipped</p>
              <p className="text-xl font-bold text-gray-900">{stats.shipped}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-xl font-bold text-gray-900">{stats.delivered}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} items
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.map(item => item.product_name).join(', ') || 'No items'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.total_amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => setViewOrder(order)} className="text-blue-600 hover:text-blue-900" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                            title="Confirm Order"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            className="text-purple-600 hover:text-purple-900"
                            title="Mark as Shipped"
                          >
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
                        
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Delivered"
                          >
                            <Package className="h-4 w-4" />
                          </button>
                        )}

                        {['pending','confirmed'].includes(order.status) && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel Order"
                          >
                            <AlertCircle className="h-4 w-4" />
                          </button>
                        )}

                        {['delivered','cancelled'].includes(order.status) && (
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Delete Order"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {viewOrder && (
        <OrderDetailsModal order={viewOrder} onClose={() => setViewOrder(null)} />
      )}
    </div>
  );
};

// Order Details Modal
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;
  const [full, setFull] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('vendorToken');
        const res = await fetch(`http://localhost:8000/api/vendor/orders/${order.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setFull(data.order || order);
        } else {
          setFull(order);
        }
      } catch {
        setFull(order);
      } finally {
        setLoading(false);
      }
    })();
  }, [order?.id]);

  const info = full || order;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Order #{order.id} Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {loading ? (
          <div className="py-6 text-center text-gray-600 text-sm">Loading details...</div>
        ) : (
        <div className="space-y-3">
          <div className="text-sm text-gray-700">Customer: <span className="font-medium">{info.user_name}</span> ({info.user_email})</div>
          <div className="text-sm text-gray-700">Status: <span className="capitalize font-medium">{info.status}</span></div>
          <div className="text-sm text-gray-700">Payment: <span className="capitalize font-medium">{info.payment_status || 'pending'}</span></div>
          <div className="text-sm text-gray-700">Created: {new Date(info.created_at).toLocaleString()}</div>
          {info.address && (
            <div className="text-sm text-gray-700">Address: {info.address.address_line1}{info.address.address_line2 ? `, ${info.address.address_line2}` : ''}, {info.address.city}, {info.address.state} - {info.address.postal_code}</div>
          )}
          <div className="mt-3">
            <div className="text-sm font-semibold mb-2">Items</div>
            <div className="border rounded">
              {info.items?.map(it => (
                <div key={it.id} className="flex items-center justify-between px-3 py-2 border-b last:border-b-0">
                  <div className="text-sm text-gray-800">{it.product_name}</div>
                  <div className="text-xs text-gray-600">Qty: {it.quantity}</div>
                  <div className="text-sm text-gray-800">₹{it.price}</div>
                  <div className="text-sm font-medium">₹{it.total}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-4">
            <div className="text-sm text-gray-700">Subtotal (vendor): <span className="font-semibold">₹{info.vendor_subtotal ?? info.total_amount}</span></div>
            <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 text-sm">Close</button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export { OrderDetailsModal };

export default OrderManagement;
