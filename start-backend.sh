#!/bin/bash

echo "🚀 Starting Davami Backend Server..."
echo "================================="

# Check if we're in the right directory
if [ ! -d "server" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Navigate to server directory
cd server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating environment file..."
    cp .env.example .env
    echo "✅ Created .env file - you may want to customize it"
fi

# Check if database has been seeded
echo "🌱 Seeding database with sample data..."
npm run seed

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. The backend server is starting on http://localhost:5000"
echo "2. Go to your frontend app (http://localhost:8080)"
echo "3. Click 'Check Again' in the demo notification"
echo "4. You'll now have full eCommerce functionality!"
echo ""
echo "🔑 Default admin credentials:"
echo "   Email: admin@davami.com"
echo "   Password: admin123"
echo ""
echo "📖 For production deployment, see PRODUCTION_DEPLOYMENT.md"
echo ""

# Start the development server
echo "🚀 Starting backend server..."
npm run dev
