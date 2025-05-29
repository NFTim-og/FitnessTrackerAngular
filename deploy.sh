#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Build the frontend
echo "Building Angular frontend..."
npm run build

# Build the backend
echo "Building backend..."
cd backend
npm install
cd ..

# Create a deployment package
echo "Creating deployment package..."
mkdir -p deploy
cp -r dist deploy/
cp -r backend deploy/
cp docker-compose.yml deploy/
cp README.md deploy/

echo "Deployment package created in the 'deploy' directory."
echo "To deploy, copy the 'deploy' directory to your server and run:"
echo "  cd deploy"
echo "  docker-compose up -d"
