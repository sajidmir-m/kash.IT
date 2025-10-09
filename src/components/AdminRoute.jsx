import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // Render the protected admin component
  return children;
};

export default AdminRoute;
