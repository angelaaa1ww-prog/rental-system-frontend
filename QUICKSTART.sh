#!/bin/bash
# PropertyFlow v2.0 - Quick Start Guide
# Run this script to set up the enhanced rental system

echo "🚀 PropertyFlow v2.0 - Setup Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "📝 Creating .env file..."

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cat > .env << EOF
# 🔐 Google OAuth Configuration
# Get your Client ID from https://console.cloud.google.com/
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE

# 🌐 API Configuration
REACT_APP_API_URL=http://localhost:3001/api

# ⚙️ Environment
REACT_APP_ENV=development

# ✨ Feature Flags
REACT_APP_ENABLE_IP_VERIFICATION=true
REACT_APP_ENABLE_TERMS_MODAL=true
REACT_APP_ENABLE_PARTICLE_EFFECTS=true

# 🔒 Security
REACT_APP_AUTHORIZED_EMAIL=isowekesa@gmail.com
REACT_APP_POLICY_VERSION=2026-07-07
EOF
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: Add your Google Client ID to .env"
    echo "   Get it from: https://console.cloud.google.com/"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "📚 Documentation:"
echo "   • SETUP_GUIDE.md - Detailed setup instructions"
echo "   • README_ENHANCED.md - Complete documentation"
echo "   • TRANSFORMATION_SUMMARY.md - What's new in v2.0"
echo ""
echo "🚀 Ready to start!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your REACT_APP_GOOGLE_CLIENT_ID"
echo "2. Run: npm start"
echo "3. Open http://localhost:3000"
echo ""
echo "Happy coding! 🎉"
