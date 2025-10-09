import { api } from './client';

// Admin-specific API functions with enhanced security
export const adminAPI = {
  // ==================== AUTHENTICATION ====================
  
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  verifyAdmin: async () => {
    const response = await api.get('/api/admin/dashboard/stats');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // ==================== DASHBOARD ====================
  
  getDashboardStats: async () => {
    const response = await api.get('/api/admin/dashboard/stats');
    return response.data;
  },

  // ==================== USER MANAGEMENT ====================
  
  getUsers: async (params = {}) => {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },

  getUser: async (userId) => {
    const response = await api.get(`/api/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/api/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  },

  // ==================== ORDER MANAGEMENT ====================
  
  getOrders: async (params = {}) => {
    const response = await api.get('/api/admin/orders', { params });
    return response.data;
  },

  getOrder: async (orderId) => {
    const response = await api.get(`/api/admin/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/api/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  // ==================== PRODUCT MANAGEMENT ====================
  
  getProducts: async (params = {}) => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/api/products', productData);
    return response.data;
  },

  updateProduct: async (productId, productData) => {
    const response = await api.put(`/api/products/${productId}`, productData);
    return response.data;
  },

  deleteProduct: async (productId) => {
    const response = await api.delete(`/api/products/${productId}`);
    return response.data;
  },

  // ==================== CATEGORY MANAGEMENT ====================
  
  getCategories: async () => {
    const response = await api.get('/api/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/api/categories', categoryData);
    return response.data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const response = await api.put(`/api/categories/${categoryId}`, categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/api/categories/${categoryId}`);
    return response.data;
  },

  // ==================== COUPON MANAGEMENT ====================
  
  getCoupons: async (params = {}) => {
    const response = await api.get('/api/coupons', { params });
    return response.data;
  },

  createCoupon: async (couponData) => {
    const response = await api.post('/api/coupons', couponData);
    return response.data;
  },

  updateCoupon: async (couponId, couponData) => {
    const response = await api.put(`/api/coupons/${couponId}`, couponData);
    return response.data;
  },

  deleteCoupon: async (couponId) => {
    const response = await api.delete(`/api/coupons/${couponId}`);
    return response.data;
  },

  // ==================== SYSTEM SETTINGS ====================
  
  getSettings: async () => {
    const response = await api.get('/api/admin/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/api/admin/settings', settings);
    return response.data;
  },

  // ==================== VENDOR MANAGEMENT ====================
  
  getVendors: async (params = {}) => {
    const response = await api.get('/api/admin/vendors', { params });
    return response.data;
  },

  getVendor: async (vendorId) => {
    const response = await api.get(`/api/admin/vendors/${vendorId}`);
    return response.data;
  },

  createVendor: async (vendorData) => {
    const response = await api.post('/api/admin/vendors/create', vendorData);
    return response.data;
  },

  updateVendor: async (vendorId, vendorData) => {
    const response = await api.put(`/api/admin/vendors/${vendorId}`, vendorData);
    return response.data;
  },

  deleteVendor: async (vendorId) => {
    const response = await api.delete(`/api/admin/vendors/${vendorId}`);
    return response.data;
  },

  // ==================== PRODUCT APPROVAL ====================
  
  getPendingProducts: async (params = {}) => {
    const response = await api.get('/api/admin/products/pending', { params });
    return response.data;
  },

  approveProduct: async (productId, isApproved) => {
    const response = await api.put(`/api/admin/products/${productId}/approve`, { is_approved: isApproved });
    return response.data;
  },

  // ==================== DELIVERY PARTNER MANAGEMENT ====================
  getDeliveryPartners: async (params = {}) => {
    const response = await api.get('/api/admin/delivery-partners', { params });
    return response.data;
  },

  updateDeliveryPartner: async (partnerId, data) => {
    const response = await api.put(`/api/admin/delivery-partners/${partnerId}`, data);
    return response.data;
  },

  deleteDeliveryPartner: async (partnerId) => {
    const response = await api.delete(`/api/admin/delivery-partners/${partnerId}`);
    return response.data;
  }
};

// Enhanced admin API client with automatic token management
export const createAdminAPIClient = () => {
  // Override the default API client for admin operations
  const adminClient = api.create ? api.create() : api;
  
  // Add admin-specific request interceptor
  adminClient.interceptors.request.use(
    (config) => {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add admin-specific response interceptor
  adminClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      
      if (status === 401 || status === 403) {
        // Clear admin session and redirect to admin login
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
          window.location.assign('/admin-login');
        }
      }
      
      return Promise.reject(error);
    }
  );

  return adminClient;
};
