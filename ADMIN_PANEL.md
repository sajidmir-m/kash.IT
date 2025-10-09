# Admin Panel Documentation

## Overview

The Kash.it Admin Panel is a secure, standalone administrative interface that provides comprehensive management capabilities for the e-commerce platform. It features role-based access control, secure authentication, and a clean, intuitive design.

## Features

### 🔐 Security Features
- **Role-based Access Control**: Only users with admin privileges can access the panel
- **JWT Authentication**: Secure token-based authentication with automatic session management
- **Protected Routes**: All admin routes are protected with authorization guards
- **Session Management**: Automatic token refresh and logout on expiration
- **Input Validation**: Comprehensive form validation and sanitization

### 📊 Dashboard Features
- **Real-time Statistics**: Live dashboard with key metrics and KPIs
- **User Management**: Complete user administration with search, filter, and bulk operations
- **Order Management**: Order tracking, status updates, and detailed order views
- **Product Management**: Product catalog management (interface ready)
- **Analytics**: Sales analytics and reporting (interface ready)
- **System Settings**: Platform configuration and settings management

### 🎨 User Interface
- **Responsive Design**: Mobile-first design that works on all devices
- **Clean Layout**: Professional, intuitive interface with sidebar navigation
- **Modern Components**: Built with React and Tailwind CSS
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Loading States**: Smooth loading indicators and error handling

## Access Points

### Admin Login
- **URL**: `/admin-login`
- **Features**: 
  - Secure login form with validation
  - Password visibility toggle
  - Security notices and warnings
  - Automatic redirect after successful login

### Admin Dashboard
- **URL**: `/admin/dashboard`
- **Features**:
  - Protected route requiring admin authentication
  - Comprehensive dashboard with statistics
  - Tabbed interface for different management sections
  - Real-time data updates

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/admin/dashboard/stats` - Verify admin access

### User Management
- `GET /api/admin/users` - Get all users with pagination
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user information
- `DELETE /api/admin/users/:id` - Delete user

### Order Management
- `GET /api/admin/orders` - Get all orders with pagination
- `GET /api/admin/orders/:id` - Get order details
- `PUT /api/admin/orders/:id/status` - Update order status

### System Management
- `GET /api/admin/settings` - Get system settings
- `PUT /api/admin/settings` - Update system settings

## File Structure

```
src/
├── pages/
│   ├── AdminLogin.jsx              # Admin login page
│   └── admin/
│       └── AdminDashboard.jsx      # Main admin dashboard
├── components/
│   ├── AdminRoute.jsx              # Protected route component
│   └── admin/
│       ├── AdminSidebar.jsx        # Navigation sidebar
│       ├── UserManagement.jsx      # User management interface
│       └── OrderManagement.jsx     # Order management interface
├── context/
│   └── AdminAuthContext.jsx        # Admin authentication context
└── api/
    └── admin.js                    # Admin API client

backend/
└── routes/
    └── admin_routes.py             # Admin API routes
```

## Setup Instructions

### 1. Backend Setup
The admin routes are automatically included in the main Flask application. No additional setup required.

### 2. Frontend Setup
The admin panel is integrated into the main React application. Access it by navigating to `/admin-login`.

### 3. Create Admin User
Use the seed script to create an admin user:

```bash
cd backend
python seed_admin.py
```

Default admin credentials:
- Email: `admin@example.com`
- Password: `Admin@123`

## Usage Guide

### 1. Login
1. Navigate to `/admin-login`
2. Enter admin credentials
3. Click "Sign In"
4. You'll be redirected to the dashboard

### 2. Dashboard Navigation
- Use the sidebar to navigate between different sections
- Overview tab shows key statistics and recent activity
- Users tab provides user management capabilities
- Orders tab allows order tracking and status updates

### 3. User Management
- View all users with pagination
- Search users by name or email
- Filter by role (admin/user) and verification status
- Edit user information and permissions
- Delete users (with confirmation)

### 4. Order Management
- View all orders with detailed information
- Search orders by customer email
- Filter by order status
- Update order status
- View detailed order information including items and addresses

## Security Considerations

### Authentication
- All admin routes require valid JWT tokens
- Tokens are automatically refreshed
- Session expires after 24 hours
- Automatic logout on token expiration

### Authorization
- Only users with `is_admin: true` can access admin features
- Role verification on every API request
- Protected routes redirect unauthorized users

### Data Protection
- All API requests include authentication headers
- Sensitive operations require confirmation
- User deletion is permanent and irreversible
- All actions are logged for audit purposes

## Customization

### Adding New Admin Features
1. Create new components in `src/components/admin/`
2. Add new API endpoints in `backend/routes/admin_routes.py`
3. Update the sidebar navigation in `AdminSidebar.jsx`
4. Add new tabs to the dashboard

### Styling
- Uses Tailwind CSS for styling
- Consistent color scheme and spacing
- Responsive design patterns
- Custom components can be styled using Tailwind classes

### API Integration
- All API calls go through the `adminAPI` client
- Automatic error handling and token management
- Consistent response formatting
- Built-in retry logic for failed requests

## Troubleshooting

### Common Issues

1. **Cannot access admin panel**
   - Ensure you're logged in with an admin account
   - Check if the user has `is_admin: true` in the database
   - Verify JWT token is valid

2. **API errors**
   - Check browser console for error messages
   - Verify backend is running and accessible
   - Check network connectivity

3. **Styling issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify responsive breakpoints

### Support
For technical support or feature requests, please contact the development team or create an issue in the project repository.

## License

This admin panel is part of the Kash.it e-commerce platform and follows the same licensing terms as the main project.
