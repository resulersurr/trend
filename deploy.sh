#!/bin/bash
set -e

echo "=== Trend Keşif Platformu - Deploy ==="

# Pull latest code
echo "[1/4] Pulling latest code..."
git pull origin main 2>/dev/null || echo "No git remote, using local files"

# Build Docker image
echo "[2/4] Building Docker image..."
docker compose build

# Run database migrations and seed
echo "[3/4] Running migrations and seed..."
docker compose run --rm app npx prisma migrate deploy
docker compose run --rm app npx tsx prisma/seed.ts

# Start the app
echo "[4/4] Starting the app..."
docker compose up -d

echo ""
echo "✅ Deploy complete! App running on http://localhost:3000"
echo "   Cloudflare DNS → Hetzner IP → port 3000"
