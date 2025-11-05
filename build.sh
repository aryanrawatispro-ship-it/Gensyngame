#!/bin/bash
# Build script for production deployment

set -e  # Exit on error

echo "Building Gensyn Valley..."

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Build complete! Frontend built to frontend/build/"
