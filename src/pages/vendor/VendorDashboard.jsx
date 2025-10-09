import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProductForm from '../../components/vendor/AddProductForm';
import OrderManagement from '../../components/vendor/OrderManagement';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Store,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingCart
} from 'lucide-react';
import toast from 'react-hot-toast';

const VendorDashboard = () => {
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', stock: '', unit: '', category_id: '', description: '' });
  const [savingProduct, setSavingProduct] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    checkVendorAuth();
  }, []);

  const checkVendorAuth = () => {
    const token = localStorage.getItem('vendorToken');
    const vendorData = localStorage.getItem('vendorUser');
    
    if (!token || !vendorData) {
      navigate('/vendor-login');
      return;
    }
    
    setVendor(JSON.parse(vendorData));
    fetchVendorData();
  };

  const fetchVendorData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vendorToken');
      
      const [profileResponse, productsResponse, statsResponse] = await Promise.all([
        fetch('http://localhost:8000/api/vendor/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8000/api/vendor/products', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8000/api/vendor/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setVendor(profileData.vendor);
        setCategories(profileData.vendor.assigned_categories || []);
      }

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.products || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      toast.error('Failed to load vendor data');
      console.error('Vendor data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      unit: product.unit || '',
      category_id: product.category_id || '',
      description: product.description || ''
    });
  };

  const closeEditProduct = () => {
    setEditingProduct(null);
    setSavingProduct(false);
  };

  const submitEditProduct = async () => {
    if (!editingProduct) return;
    try {
      setSavingProduct(true);
      const token = localStorage.getItem('vendorToken');
      const res = await fetch(`http://localhost:8000/api/vendor/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          price: Number(editForm.price),
          stock: Number(editForm.stock),
          unit: editForm.unit || undefined,
          category_id: editForm.category_id ? Number(editForm.category_id) : undefined,
          description: editForm.description || undefined
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update product');
      }
      toast.success('Product updated');
      closeEditProduct();
      await fetchVendorData();
    } catch (e) {
      toast.error(e?.message || 'Update failed');
      setSavingProduct(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('vendorToken');
      const res = await fetch(`http://localhost:8000/api/vendor/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete');
      }
      toast.success('Product deleted');
      await fetchVendorData();
    } catch (e) {
      toast.error(e?.message || 'Delete failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorUser');
    navigate('/vendor-login');
    toast.success('Logged out successfully');
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

  const getStatusColor = (isApproved, isActive) => {
    if (!isActive) return 'bg-red-100 text-red-800';
    if (isApproved) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (isApproved, isActive) => {
    if (!isActive) return 'Inactive';
    if (isApproved) return 'Approved';
    return 'Pending';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Vendor</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'orders', name: 'Orders', icon: ShoppingCart },
              { id: 'history', name: 'Order History', icon: Clock },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-green-100 text-green-700 border-r-2 border-green-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
                <h1 className="ml-2 lg:ml-0 text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {vendor?.business_name || 'Vendor'}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  vendor?.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {vendor?.is_approved ? 'Approved' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Overview */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Package className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.products.total}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Approved</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.products.approved}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.products.pending}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.products.active}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Assigned Categories */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Products */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Products</h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.is_approved, product.is_active)}`}>
                          {getStatusText(product.is_approved, product.is_active)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
                <button 
                  onClick={() => setShowAddProductForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.category_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{product.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock} {product.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.is_approved, product.is_active)}`}>
                              {getStatusText(product.is_approved, product.is_active)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-indigo-600 hover:text-indigo-900" onClick={() => openEditProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900" onClick={() => deleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <OrderManagement />
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
              </div>
              <OrderManagement initialFilter="all" />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <input
                      type="text"
                      value={vendor?.business_name || ''}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Type</label>
                    <input
                      type="text"
                      value={vendor?.business_type || ''}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={vendor?.user?.email || ''}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={vendor?.phone || ''}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      readOnly
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Form Modal */}
      {showAddProductForm && (
        <AddProductForm
          onClose={() => setShowAddProductForm(false)}
          onProductAdded={fetchVendorData}
          categories={categories}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Product</h3>
              <button onClick={closeEditProduct} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={editForm.name}
                  onChange={(e) => setEditForm(v => ({ ...v, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={editForm.price}
                    onChange={(e) => setEditForm(v => ({ ...v, price: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={editForm.stock}
                    onChange={(e) => setEditForm(v => ({ ...v, stock: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <input
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={editForm.unit}
                    onChange={(e) => setEditForm(v => ({ ...v, unit: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={editForm.category_id}
                    onChange={(e) => setEditForm(v => ({ ...v, category_id: e.target.value }))}
                  >
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm(v => ({ ...v, description: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button onClick={closeEditProduct} className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 text-sm">Cancel</button>
              <button onClick={submitEditProduct} disabled={savingProduct} className="px-4 py-2 rounded-md bg-green-600 text-white text-sm disabled:opacity-50">
                {savingProduct ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
