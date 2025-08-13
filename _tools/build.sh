#!/bin/bash

# ./_tools/build.sh

set -e

echo "🔧 Starting SleepyBlog build process..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "🚀 You can now run 'npm start' to serve the production build"
