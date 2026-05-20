#!/bin/bash

echo "🚀 Deploying SecureCloud Inventory Manager"
echo "==========================================="

# Build Docker images
echo "📦 Building Docker images..."
docker build -t securecloud-backend:latest -f app/backend/Dockerfile app/backend/
docker build -t securecloud-frontend:latest -f app/frontend/Dockerfile app/frontend/

# Run with Docker Compose
echo "🐳 Starting containers..."
cd docker
docker-compose up -d

echo "✅ Deployment complete!"
echo "🌐 Access at: http://localhost:3000"
