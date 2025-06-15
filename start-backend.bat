@echo off
echo 🚀 Starting Davami Backend Server...
echo =================================

REM Check if we're in the right directory
if not exist "server" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

REM Navigate to server directory
cd server

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Check if .env exists
if not exist ".env" (
    echo ⚙️  Creating environment file...
    copy .env.example .env
    echo ✅ Created .env file - you may want to customize it
)

REM Seed database
echo 🌱 Seeding database with sample data...
npm run seed

echo.
echo 🎉 Backend setup complete!
echo.
echo 📋 Next steps:
echo 1. The backend server is starting on http://localhost:5000
echo 2. Go to your frontend app (http://localhost:8080)
echo 3. Click 'Check Again' in the demo notification
echo 4. You'll now have full eCommerce functionality!
echo.
echo 🔑 Default admin credentials:
echo    Email: admin@davami.com
echo    Password: admin123
echo.
echo 📖 For production deployment, see PRODUCTION_DEPLOYMENT.md
echo.

REM Start the development server
echo 🚀 Starting backend server...
npm run dev

pause
