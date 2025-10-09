import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';
import { Eye, Edit, Trash2, Search, Filter, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: 10,
        search: searchTerm,
        status: statusFilter
      };
      
      const response = await adminAPI.getVendors(params);
      setVendors(response.vendors || []);
      setTotalPages(response.pages || 1);
    } catch (error) {
      toast.error('Failed to fetch vendors');
      console.error('Vendors fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [currentPage, searchTerm, statusFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleApproveVendor = async (vendorId, isApproved) => {
    try {
      await adminAPI.updateVendor(vendorId, { is_approved: isApproved });
      toast.success(`Vendor ${isApproved ? 'approved' : 'rejected'} successfully`);
      fetchVendors();
    } catch (error) {
      toast.error('Failed to update vendor status');
      console.error('Vendor update error:', error);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm('Delete this vendor? This will remove their account and data.')) return;
    try {
      await adminAPI.deleteVendor(vendorId);
      toast.success('Vendor deleted successfully');
      fetchVendors();
    } catch (error) {
      toast.error('Failed to delete vendor');
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Vendor Management</h2>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No vendors found
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vendor.business_name}</div>
                        <div className="text-sm text-gray-500">{vendor.business_type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{vendor.email}</div>
                        <div className="text-sm text-gray-500">{vendor.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{vendor.city}, {vendor.state}</div>
                        <div className="text-sm text-gray-500">{vendor.pincode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor.is_approved, vendor.is_active)}`}>
                        {getStatusText(vendor.is_approved, vendor.is_active)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(vendor.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {!vendor.is_approved && vendor.is_active && (
                          <>
                            <button
                              onClick={() => handleApproveVendor(vendor.id, true)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve Vendor"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleApproveVendor(vendor.id, false)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Vendor"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button className="text-blue-600 hover:text-blue-900" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteVendor(vendor.id)} className="text-red-600 hover:text-red-900" title="Delete Vendor">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
