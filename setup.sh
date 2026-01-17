#!/bin/bash

# TheScene - Quick Start Script
# Run this script to install and start the application

echo "🚀 TheScene - Social Media App Setup"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

echo "✅ Node.js found: $(node -v)"

# Check if MongoDB is available
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. You'll need to start MongoDB manually or use MongoDB Atlas."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

echo "✅ Backend setup complete"
cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

echo "✅ Frontend setup complete"
cd ..

echo ""
echo "===================================="
echo "✨ Setup Complete!"
echo "===================================="
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Then visit http://localhost:3000"
echo ""
echo "Happy coding! 🎉"
