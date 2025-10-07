# Kash.it - E-commerce Platform

A modern e-commerce platform built with React (Vite) frontend and Flask backend.

## Features

- User authentication and registration
- Product catalog with categories
- Shopping cart functionality
- Order management
- Address management
- User profile management
- Customer support
- IoT device integration

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons
- React Hot Toast for notifications

### Backend
- Flask with Python
- SQLAlchemy for database ORM
- JWT for authentication
- Flask-Mail for email services
- PostgreSQL/SQLite for database
- CORS enabled for cross-origin requests

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Frontend Setup
```bash
cd kashit-main
npm install
npm run dev
```

### Backend Setup
```bash
cd kashit-main/backend
pip install -r deps.txt
python main.py
```

### Environment Variables
1. Copy `.env.example` to `.env.local` (frontend)
2. Copy `backend/.env.example` to `backend/.env` (backend)
3. Update the values as needed

## Production Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set Root Directory: `kashit-main/backend`
4. Build Command: `pip install --upgrade pip && pip install -r deps.txt`
5. Start Command: `gunicorn "main:create_app()" --bind 0.0.0.0:$PORT`
6. Add environment variables in Render dashboard
7. Add PostgreSQL database if needed

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set Root Directory: `kashit-main`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add environment variables in Vercel dashboard
6. Deploy

### Required Environment Variables

#### Backend (Render)
- `JWT_SECRET_KEY`: Strong secret key for JWT tokens
- `SESSION_SECRET`: Strong secret key for sessions
- `DATABASE_URL`: PostgreSQL connection string (recommended for production)
- `MAIL_USERNAME`: Email username (optional)
- `MAIL_PASSWORD`: Email password (optional)

#### Frontend (Vercel)
- `VITE_API_BASE_URL`: Your backend URL (e.g., https://your-backend.onrender.com)

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products
- `GET /api/categories` - Get all categories
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get user cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `POST /api/addresses` - Add address
- `GET /api/addresses` - Get user addresses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.