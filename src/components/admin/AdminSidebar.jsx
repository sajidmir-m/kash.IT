import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  BarChart3,
  LogOut,
  Shield,
  Store,
  CheckCircle
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'users', name: 'Users', icon: Users, path: '/admin/dashboard' },
    { id: 'vendors', name: 'Vendors', icon: Store, path: '/admin/dashboard' },
    { id: 'orders', name: 'Orders', icon: ShoppingCart, path: '/admin/dashboard' },
    { id: 'products', name: 'Products', icon: Package, path: '/admin/dashboard' },
    { id: 'approvals', name: 'Approvals', icon: CheckCircle, path: '/admin/dashboard' },
    { id: 'delivery', name: 'Delivery', icon: Store, path: '/admin/dashboard' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, path: '/admin/dashboard' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/admin/dashboard' }
  ];

  const handleMenuClick = (item) => {
    if (item.id === 'overview') {
      navigate('/admin/dashboard');
    } else {
      // For other items, we'll use the tab system in the dashboard
      navigate('/admin/dashboard', { state: { activeTab: item.id } });
    }
    if (onClose) onClose();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path && 
                (!location.state?.activeTab || location.state.activeTab === item.id);
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
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
    </>
  );
};

export default AdminSidebar;
