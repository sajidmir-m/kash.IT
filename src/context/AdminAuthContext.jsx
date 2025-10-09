import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../api/admin';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const storedUser = localStorage.getItem('adminUser');
        
        if (token && storedUser) {
          // Verify token is still valid by making a test request
          await adminAPI.verifyAdmin();
          setAdminUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Token is invalid or expired
        adminAPI.logout();
        setAdminUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminSession();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await adminAPI.login(email, password);
      
      if (response.user && response.user.is_admin) {
        const { access_token, user } = response;
        
        // Store admin token and user data
        localStorage.setItem('adminToken', access_token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        
        setAdminUser(user);
        setIsAuthenticated(true);
        
        return { success: true, user };
      } else {
        throw new Error('Access denied. Admin privileges required.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    adminAPI.logout();
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    adminUser,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
