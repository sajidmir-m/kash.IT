import axios from 'axios';

// Use environment variable for API URL with fallback
// In production, this will use the VITE_API_BASE_URL from environment variables
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? 'https://kashit-backend.onrender.com' : 'http://127.0.0.1:8000');

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000,
  withCredentials: true
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      try {
        localStorage.removeItem('accessToken');
      } catch {}
      // Redirect to login (soft redirect to preserve SPA state)
      if (typeof window !== 'undefined') {
        const redirectTo = '/login';
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


