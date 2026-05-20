#!/bin/bash

echo "🔍 Starting Security Scans..."
echo "=============================="

# Scan backend code
echo "📁 Scanning backend code..."
trivy fs ../app/backend --severity HIGH,CRITICAL --exit-code 0

# Scan frontend code
echo "📁 Scanning frontend code..."
trivy fs ../app/frontend/src --severity HIGH,CRITICAL --exit-code 0

# Scan Docker images
echo "🐳 Scanning Docker images..."
trivy image securecloud-backend:latest --severity HIGH,CRITICAL --exit-code 0
trivy image securecloud-frontend:latest --severity HIGH,CRITICAL --exit-code 0

# Scan Kubernetes files
echo "☸️ Scanning Kubernetes manifests..."
trivy config ../kubernetes/*.yaml --severity HIGH,CRITICAL --exit-code 0

echo "✅ Security scans completed!"
