#!/bin/bash
# JacobTechLabs API Update Script
# Run this to update the application after code changes

set -e

APP_DIR="/home/opc/Fundz/exercise_plug"
SERVICE_NAME="jacobtechlabs-api"

echo "🔄 Updating JacobTechLabs API..."

# Stop service
echo "🛑 Stopping service..."
sudo systemctl stop $SERVICE_NAME

# Update code
echo "⬇️  Pulling latest code..."
cd "$APP_DIR"
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Build application
echo "🏗️  Building application..."
bun run build

# Restart service
echo "▶️  Starting service..."
sudo systemctl start $SERVICE_NAME

# Verify
echo "✅ Verifying..."
sleep 2
sudo systemctl status $SERVICE_NAME --no-pager

echo ""
echo "🎉 Update complete!"
echo "   Test: curl https://api.jacobtech.xyz/health"
