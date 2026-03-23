#!/bin/bash
# ── Local Deployment Script ──────────────────────────────
# Quick local deployment without Ansible (for development)
# Usage: ./scripts/deploy-local.sh

set -euo pipefail

IMAGE_NAME="${DOCKER_IMAGE:-devops-pipeline-app}"
CONTAINER_NAME="devops-pipeline-app"
PORT="${PORT:-3000}"

echo "🚀 Starting local deployment..."

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t "$IMAGE_NAME:latest" -f docker/Dockerfile app/

# Stop existing container if running
echo "🛑 Stopping old container..."
docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

# Run new container
echo "▶️  Starting new container..."
docker run -d \
  --name "$CONTAINER_NAME" \
  -p "$PORT:3000" \
  -e NODE_ENV=production \
  --restart unless-stopped \
  "$IMAGE_NAME:latest"

# Wait for health check
echo "⏳ Waiting for health check..."
sleep 3

if curl -sf "http://localhost:$PORT/health" > /dev/null 2>&1; then
  echo "✅ Deployment successful! App running at http://localhost:$PORT"
  echo "   Health: http://localhost:$PORT/health"
else
  echo "❌ Health check failed. Check logs with: docker logs $CONTAINER_NAME"
  exit 1
fi
