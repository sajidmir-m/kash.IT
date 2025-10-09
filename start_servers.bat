@echo off
echo Starting Kash.it E-commerce Platform...
echo.

echo Starting Backend Server (Flask)...
start "Backend Server" cmd /k "cd backend && python main.py"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server (React)...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo Admin Panel: http://localhost:5173/admin-login
echo.
echo Admin Credentials:
echo Email: admin@kashit.com
echo Password: Admin@123
echo.
pause
