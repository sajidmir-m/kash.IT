import axios from 'axios';

// Use environment variable for API URL with fallback
// In production, this will use the VITE_API_BASE_URL from environment variables
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? 'https://kashit-backend.onrender.com' : 'http://localhost:8000');

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000,
  withCredentials: true
});

// Request interceptor to add JWT token (prefer admin token on admin routes)
api.interceptors.request.use(
  (config) => {
    const url = (config?.url || '');
    const isAdminRoute = url.startsWith('/api/admin');
    const isPublicCatalog = url.startsWith('/api/products') || url.startsWith('/api/categories');
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('accessToken');

    // Do not send Authorization on public catalog endpoints to avoid any auth side-effects
    if (!isPublicCatalog) {
      const tokenToUse = isAdminRoute && adminToken ? adminToken : userToken;
      if (tokenToUse) config.headers.Authorization = `Bearer ${tokenToUse}`;
    } else {
      if (config.headers.Authorization) delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const message = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Request failed';

    if (status === 401 || status === 403) {
      const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      try {
        if (isAdminPath) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      } catch {}
      // Redirect to appropriate login
      if (typeof window !== 'undefined') {
        const redirectTo = isAdminPath ? '/admin-login' : '/login';
        if (window.location.pathname !== redirectTo) {
          window.location.assign(redirectTo);
        }
      }
    }

    const error = new Error(message);
    error.response = err.response;
    return Promise.reject(error);
  }
);


