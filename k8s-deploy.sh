#!/bin/bash

echo "☸️ Deploying to Kubernetes"
echo "=========================="

# Build images for Minikube
eval $(minikube docker-env)
docker build -t securecloud-backend:latest -f app/backend/Dockerfile app/backend/
docker build -t securecloud-frontend:latest -f app/frontend/Dockerfile app/frontend/

# Apply Kubernetes manifests
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secrets.yaml
kubectl apply -f kubernetes/mongodb-deployment.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml

# Wait for deployments
kubectl wait --for=condition=available --timeout=300s deployment/backend -n securecloud
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n securecloud

# Get URL
minikube service frontend-service -n securecloud --url

echo "✅ Kubernetes deployment complete!"
