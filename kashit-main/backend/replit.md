# Kash.it - Full-Stack E-Commerce Platform

## Overview

Kash.it is a complete full-stack grocery e-commerce platform with IoT device integration. The system features a Flask RESTful API backend and a React frontend, enabling users to browse products, manage shopping carts, place orders, apply discount coupons, and register IoT devices (such as Arduino/NodeMCU boards) to their accounts. The platform includes email-based OTP verification for authentication and supports real-time sensor data collection from connected IoT devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
**Problem:** Need a modern, responsive user interface for the e-commerce platform.

**Solution:** React single-page application (SPA) built with Vite, connecting to the Flask backend via RESTful API.

**Implementation:**
- React 18 with functional components and hooks
- React Router for client-side routing with protected routes
- Axios for HTTP requests with JWT token management
- Responsive CSS design with gradient themes
- Authentication state management with localStorage persistence
- Auth loading state to prevent redirect loops on page refresh

**Pages & Features:**
- **Home** - Hero section with call-to-action and feature highlights
- **Authentication** - Login, Register, and OTP Verification pages
- **Products** - Product listing with category filter, search, and pagination
- **Product Detail** - Single product view with add-to-cart functionality
- **Shopping Cart** - Cart management with quantity updates and item removal
- **Checkout** - Order placement with address selection and coupon validation
- **Orders** - Order history with status tracking
- **Profile** - User profile management and address CRUD operations
- **Admin Dashboard** - Comprehensive admin panel for managing products, categories, orders, and coupons
- **IoT Devices** - Device registration and sensor data viewing

**Rationale:** React provides component reusability and efficient rendering. Vite offers fast development with hot module replacement. Client-side routing creates a seamless user experience.

**Pros:**
- Component-based architecture for maintainability
- Fast development with Vite HMR
- Responsive design works on all devices
- Smooth user experience with client-side routing

**Cons:**
- Requires JavaScript enabled in browser
- SEO considerations for SPA (can be addressed with SSR if needed)

### Backend Framework
**Problem:** Need a lightweight, flexible backend framework for rapid API development.

**Solution:** Flask with Flask-RESTful patterns using Blueprints for modular route organization.

**Rationale:** Flask provides minimal overhead while offering extensive extension support. The Blueprint pattern enables clean separation of concerns across different API modules (auth, products, cart, orders, coupons, IoT).

**Pros:**
- Lightweight and fast
- Excellent ecosystem of extensions
- Easy to understand and maintain
- Flexible for custom integrations

**Cons:**
- Requires manual configuration compared to full-stack frameworks
- No built-in admin interface

### Authentication & Authorization
**Problem:** Secure user authentication with role-based access control and email verification.

**Solution:** JWT (JSON Web Tokens) via Flask-JWT-Extended with custom decorators for role verification.

**Implementation:**
- Access tokens expire in 24 hours
- Refresh tokens expire in 30 days
- OTP-based email verification (6-digit code, 10-minute expiry)
- Custom decorators: `@admin_required` and `@verified_user_required`
- Password hashing using Werkzeug's security utilities

**Rationale:** JWTs provide stateless authentication suitable for RESTful APIs. OTP verification adds security without requiring third-party authentication providers.

### Database Architecture
**Problem:** Need persistent storage for users, products, orders, and IoT sensor data.

**Solution:** SQLAlchemy ORM with PostgreSQL (via DATABASE_URL environment variable).

**Schema Design:**
- **Users Table:** Core authentication with email, password hash, OTP fields
- **Products & Categories:** Standard e-commerce catalog structure
- **Cart & Orders:** Separate cart management before order placement
- **Coupons:** Flexible discount system (percentage/fixed) with usage limits
- **IoT Devices & Sensor Data:** Device registration and time-series sensor readings
- **Addresses:** Multiple delivery addresses per user

**Database Features:**
- Connection pooling with `pool_recycle` and `pool_pre_ping` for reliability
- Flask-Migrate for schema version control
- Cascade deletes for data integrity
- Indexed email field for fast lookups

**Rationale:** SQLAlchemy provides database-agnostic ORM capabilities. PostgreSQL offers robust relational features, JSON support, and scalability.

### Email Service
**Problem:** Sending transactional emails for OTP verification and password resets.

**Solution:** Flask-Mail with asynchronous email delivery using threading.

**Configuration:**
- Default SMTP server: Gmail (configurable)
- Asynchronous sending to prevent blocking API responses
- HTML and plain text email templates
- Environment variable configuration for credentials

**Rationale:** Threaded email delivery ensures API endpoints remain responsive. HTML templates improve user experience.

### API Structure
**Modular Blueprint Organization:**
- `/api/auth` - Registration, login, OTP verification, password reset
- `/api/products` - Product CRUD, search, filtering
- `/api/categories` - Category management
- `/api/cart` - Shopping cart operations
- `/api/orders` - Order placement and tracking
- `/api/coupons` - Coupon validation and management
- `/api/iot` - IoT device registration and sensor data

**Design Pattern:**
- RESTful conventions (GET, POST, PUT, DELETE)
- JSON request/response format
- Consistent error response structure
- JWT required for authenticated endpoints

### Security Architecture
**Security Measures:**
- Password hashing with salted hashes (Werkzeug)
- JWT token expiration and refresh mechanism
- Email verification requirement for sensitive operations
- Admin-only endpoints for product/coupon management
- OTP expiration to prevent replay attacks
- Environment-based secret key management

**Best Practices:**
- Secrets stored in environment variables
- Separate dev and production configurations
- CORS enabled for frontend integration
- SQL injection prevention via ORM parameterization

### IoT Integration
**Problem:** Connect and manage IoT devices (Arduino, NodeMCU) for users.

**Solution:** Device registration system with unique device IDs and sensor data storage.

**Features:**
- Device registration with unique device_id validation
- Device status tracking (active/inactive)
- Last active timestamp for monitoring
- Sensor data collection endpoints
- User ownership validation

**Rationale:** Enables future features like smart grocery inventory tracking, temperature monitoring for perishables, or automated reordering based on sensor data.

## External Dependencies

### Core Framework Dependencies
- **Flask** - Web framework for API development
- **Flask-CORS** - Cross-origin resource sharing support for frontend integration
- **Flask-SQLAlchemy** - ORM for database operations
- **Flask-Migrate** - Database migration management using Alembic
- **Flask-JWT-Extended** - JWT-based authentication
- **Flask-Mail** - Email delivery service
- **Werkzeug** - Password hashing and security utilities

### Database
- **PostgreSQL** - Primary relational database (configured via `DATABASE_URL` environment variable)
- **SQLAlchemy** - Database abstraction layer supporting multiple database backends

### Email Service
- **SMTP Server** - Email delivery (default: Gmail SMTP)
  - Configuration via environment variables: `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
  - Supports TLS/SSL encryption
  - Asynchronous delivery using Python threading

### Configuration Management
- **Environment Variables:**
  - `DATABASE_URL` - PostgreSQL connection string
  - `SESSION_SECRET` - Flask session encryption key
  - `JWT_SECRET_KEY` - JWT token signing key
  - `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` - Email service configuration
  - `MAIL_DEFAULT_SENDER` - Default sender email address

### Deployment Configuration
**Workflows:**
- **Backend API** - Flask server running on port 8000 (console output)
- **Kash.it** - React frontend running on port 5000 (webview)

**Frontend Development:**
- Vite configured to proxy `/api` requests to backend on port 8000
- Environment-aware API configuration
- Build command: `npm run build` (creates production-ready static files)

### Future Integration Points
- **Payment Gateway** - Currently uses dummy payment status (ready for Stripe/PayPal integration)
- **Google Maps/OpenStreetMap API** - For delivery tracking (infrastructure ready, not yet implemented)
- **Cloud Storage** - For product images (currently uses image URLs)
- **Server-Side Rendering** - For improved SEO (can be added with Next.js if needed)