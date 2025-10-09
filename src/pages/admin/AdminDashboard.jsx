import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminAPI } from '../../api/admin';
import AdminSidebar from '../../components/admin/AdminSidebar';
import UserManagement from '../../components/admin/UserManagement';
import OrderManagement from '../../components/admin/OrderManagement';
import VendorManagement from '../../components/admin/VendorManagement';
import DeliveryPartners from '../../components/admin/DeliveryPartners';
import ProductApproval from '../../components/admin/ProductApproval';
import CreateVendor from '../../components/admin/CreateVendor';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Menu,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { adminUser, logout } = useAdminAuth();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateVendor, setShowCreateVendor] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Set active tab from location state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, ordersData, vendorsData, pendingProductsData] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getUsers({ page: 1, per_page: 10 }),
        adminAPI.getOrders({ page: 1, per_page: 10 }),
        adminAPI.getVendors({ page: 1, per_page: 10 }),
        adminAPI.getPendingProducts({ page: 1, per_page: 10 })
      ]);
      
      setStats(statsData);
      setUsers(usersData.users || []);
      setOrders(ordersData.orders || []);
      setVendors(vendorsData.vendors || []);
      setPendingProducts(pendingProductsData.products || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
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

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="ml-2 lg:ml-0 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {adminUser?.full_name || adminUser?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition duration-150"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.users.total}</p>
                  <p className="text-xs text-green-600">
                    {stats.users.verified} verified
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.products.active}</p>
                  <p className="text-xs text-gray-500">
                    {stats.products.categories} categories
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.orders.total}</p>
                  <p className="text-xs text-yellow-600">
                    {stats.orders.pending} pending
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.revenue.total)}
                  </p>
                  <p className="text-xs text-green-600">
                    {formatCurrency(stats.revenue.monthly)} this month
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: Activity },
                { id: 'users', name: 'Users', icon: Users },
                { id: 'vendors', name: 'Vendors', icon: Users },
                { id: 'orders', name: 'Orders', icon: ShoppingCart },
                { id: 'products', name: 'Products', icon: Package },
                { id: 'approvals', name: 'Approvals', icon: Eye },
                { id: 'delivery', name: 'Delivery', icon: Users }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Orders */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                      {stats?.recent_orders?.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.user_email}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(order.total_amount)}
                            </p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Products */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
                    <div className="space-y-3">
                      {stats?.top_products?.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-500 mr-2">#{index + 1}</span>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          </div>
                          <p className="text-sm text-gray-600">{product.total_sold} sold</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && <UserManagement />}

            {/* Vendors Tab */}
            {activeTab === 'vendors' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Vendor Management</h3>
                  <button 
                    onClick={() => setShowCreateVendor(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Create Vendor
                  </button>
                </div>
                <VendorManagement />
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && <OrderManagement />}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Product Management</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    Add Product
                  </button>
                </div>
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Product management interface will be implemented here</p>
                </div>
              </div>
            )}

            {/* Approvals Tab */}
            {activeTab === 'approvals' && <ProductApproval />}
            {activeTab === 'delivery' && <DeliveryPartners />}
          </div>
        </div>
        </div>
      </div>

      {/* Create Vendor Modal */}
      <CreateVendor
        isOpen={showCreateVendor}
        onClose={() => setShowCreateVendor(false)}
        onVendorCreated={() => {
          fetchDashboardData(); // Refresh data
        }}
      />
    </div>
  );
};

export default AdminDashboard;
