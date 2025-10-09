# Database Setup Guide for Kash.it E-commerce Platform

## 🗄️ Database Configuration Options

The project supports both **PostgreSQL** (recommended for production) and **SQLite** (for development). Here's how to set up each:

## Option 1: SQLite (Quick Start - Development)

### Setup Steps:
1. **No additional setup required** - SQLite will be created automatically
2. **Database file location**: `backend/database.db`
3. **Start the application** - The database will be created on first run

### Advantages:
- ✅ No installation required
- ✅ Perfect for development and testing
- ✅ File-based database
- ✅ Works immediately

### Disadvantages:
- ❌ Not suitable for production
- ❌ Limited concurrent users
- ❌ No advanced features

---

## Option 2: PostgreSQL (Recommended for Production)

### Prerequisites:
- PostgreSQL installed on your system
- Python with psycopg2-binary (already included in dependencies)

### Setup Steps:

#### 1. Install PostgreSQL
**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the password you set for the 'postgres' user

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2. Create Database and User
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE kashit_db;

-- Create user (optional - you can use postgres user)
CREATE USER kashit_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE kashit_db TO kashit_user;

-- Exit psql
\q
```

#### 3. Set Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://kashit_user:your_secure_password@localhost:5432/kashit_db

# Security Keys (CHANGE THESE IN PRODUCTION!)
JWT_SECRET_KEY=your-super-secret-jwt-key-here-change-in-production-2024
SESSION_SECRET=your-super-secret-session-key-here-change-in-production-2024

# Email Configuration (Optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=kashit.kashmir@gmail.com

# Development Settings
DEBUG=True
FLASK_ENV=development
```

#### 4. Initialize Database Tables
```bash
cd backend
python -c "from main import create_app; from models import db; app = create_app(); app.app_context().push(); db.create_all(); print('Database tables created successfully!')"
```

#### 5. Create Admin User
```bash
cd backend
python seed_admin.py
```

---

## Option 3: Cloud Database (Production)

### Using Render (Free PostgreSQL)
1. Go to https://render.com
2. Create a new PostgreSQL database
3. Copy the connection string
4. Set it as `DATABASE_URL` in your environment variables

### Using Railway
1. Go to https://railway.app
2. Create a new PostgreSQL database
3. Copy the connection string
4. Set it as `DATABASE_URL` in your environment variables

### Using Supabase
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Set it as `DATABASE_URL` in your environment variables

---

## 🔧 Environment Variables Setup

### For Local Development:
Create `backend/.env` file:
```env
# For SQLite (default)
# DATABASE_URL=

# For PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/kashit_db

# Security (CHANGE THESE!)
JWT_SECRET_KEY=your-jwt-secret-key-here
SESSION_SECRET=your-session-secret-key-here

# Email (Optional)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### For Production (Vercel/Render):
Set these environment variables in your hosting platform:

**Backend (Render):**
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET_KEY` - Strong secret key for JWT tokens
- `SESSION_SECRET` - Strong secret key for sessions
- `MAIL_USERNAME` - Email username (optional)
- `MAIL_PASSWORD` - Email password (optional)

**Frontend (Vercel):**
- `VITE_API_BASE_URL` - Your backend URL (e.g., https://your-backend.onrender.com)

---

## 🚀 Quick Start Commands

### 1. Start with SQLite (Easiest)
```bash
# Backend
cd backend
pip install -r deps.txt
python main.py

# Frontend (in new terminal)
cd ../
npm install
npm run dev
```

### 2. Start with PostgreSQL
```bash
# 1. Install PostgreSQL and create database (see steps above)
# 2. Create .env file with DATABASE_URL
# 3. Start backend
cd backend
pip install -r deps.txt
python main.py

# 4. Start frontend
cd ../
npm install
npm run dev
```

---

## 🔍 Verify Database Connection

### Check if database is connected:
1. **Start the backend server**
2. **Look for these messages in console:**
   ```
   * Running on all addresses (0.0.0.0)
   * Running on http://127.0.0.1:8000
   * Database connected successfully
   ```

3. **Test the API:**
   - Visit: `http://localhost:8000/health`
   - Should return: `{"status": "healthy"}`

4. **Test admin panel:**
   - Visit: `http://localhost:5173/admin-login`
   - Login with: `admin@example.com` / `Admin@123`

---

## 🛠️ Troubleshooting

### Common Issues:

1. **"Database not found" error:**
   - Check if PostgreSQL is running
   - Verify DATABASE_URL format
   - Ensure database exists

2. **"Permission denied" error:**
   - Check database user permissions
   - Verify password is correct

3. **"Connection refused" error:**
   - Check if PostgreSQL is running
   - Verify host and port settings

4. **SQLite file not created:**
   - Check file permissions
   - Ensure backend directory is writable

### Database Connection Test:
```python
# Test database connection
from main import create_app
from models import db

app = create_app()
with app.app_context():
    try:
        db.engine.execute('SELECT 1')
        print("✅ Database connected successfully!")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
```

---

## 📊 Database Schema

The project includes these tables:
- `users` - User accounts and authentication
- `addresses` - User shipping addresses
- `categories` - Product categories
- `products` - Product catalog
- `cart_items` - Shopping cart items
- `orders` - Order management
- `order_items` - Individual order line items
- `coupons` - Discount coupon system
- `iot_devices` - IoT device management
- `sensor_data` - IoT sensor readings

All tables are automatically created when you start the application for the first time.

---

## 🔐 Security Notes

1. **Never commit `.env` files** to version control
2. **Use strong, unique passwords** for database users
3. **Change default JWT and session secrets** in production
4. **Use environment variables** for all sensitive data
5. **Enable SSL** for production database connections

---

## 📝 Next Steps

After setting up the database:

1. **Test the main e-commerce site** at `http://localhost:5173`
2. **Test the admin panel** at `http://localhost:5173/admin-login`
3. **Create some test data** through the admin panel
4. **Deploy to production** with proper environment variables

The database will work seamlessly with both the main e-commerce functionality and the admin panel once properly configured!
