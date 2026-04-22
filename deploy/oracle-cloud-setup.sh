#!/bin/bash
# JacobTechLabs API - Oracle Cloud ARM64 Deployment Script
# For Oracle Linux (ARM64/Ampere A1) - uses dnf package manager
# Run this on your Oracle Cloud server as root or with sudo

set -e  # Exit on any error

echo "🚀 Starting JacobTechLabs API deployment..."

# Configuration
APP_DIR="/home/opc/Fundz/exercise_plug"
DOMAIN="api.jacobtech.xyz"
SERVICE_NAME="jacobtechlabs-api"
USER="opc"

# Step 1: System Update
echo "📦 Updating system packages..."
sudo dnf update -y --allowerasing || sudo dnf update -y --nobest || echo "⚠️  Some packages failed to update, continuing..."

# Step 2: Install Dependencies (Oracle Linux uses dnf)
echo "🔧 Installing required packages..."
sudo dnf install -y --skip-broken curl git unzip nginx firewalld || echo "⚠️  Some packages may have conflicts, continuing..."

# Install certbot separately to handle python issues
sudo dnf install -y --skip-broken certbot python3-certbot-nginx || echo "⚠️  Certbot may need manual installation"

# Step 3: Install Bun
echo "🥟 Installing Bun runtime..."
if ! command -v bun &> /dev/null; then
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
    echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
fi

# Ensure bun is in PATH for this session
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Step 4: Install Dependencies & Build (code is already in current directory)
echo "🏗️  Installing dependencies and building..."
cd "$APP_DIR"
bun install
bun run build

# Step 5: Create Systemd Service
echo "⚙️  Creating systemd service..."
sudo tee /etc/systemd/system/$SERVICE_NAME.service << EOF
[Unit]
Description=JacobTechLabs Fitness API
After=network.target

[Service]
Type=simple
User=$USER
Group=$USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=CORS_ORIGIN=*
Environment=PATH=/home/opc/.bun/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=/home/opc/.bun/bin/bun run start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME

[Install]
WantedBy=multi-user.target
EOF

# Step 6: Enable and Start Service
echo "▶️  Enabling and starting service..."
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME

# Step 7: Configure Nginx
echo "🌐 Configuring Nginx..."

# Create Nginx config directory if needed
sudo mkdir -p /etc/nginx/conf.d

sudo tee /etc/nginx/conf.d/jacobtechlabs.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name api.jacobtech.xyz;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Proxy to Bun app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check for monitoring
    location /nginx-health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Backup and update nginx.conf if needed
if [ -f /etc/nginx/nginx.conf ]; then
    sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
fi

sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Step 8: Configure SSL with Let's Encrypt
echo "🔒 Setting up SSL with Let's Encrypt..."
sudo certbot --nginx -d api.jacobtech.xyz --agree-tos --non-interactive --email admin@jacobtech.xyz || true

# Step 9: Configure Firewall (firewalld for Oracle Linux)
echo "🛡️  Configuring firewall..."
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Allow required services
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https

# Reload firewall
sudo firewall-cmd --reload

# Step 10: Verify Deployment
echo "✅ Verifying deployment..."
sleep 3

echo ""
echo "=== Service Status ==="
sudo systemctl status $SERVICE_NAME --no-pager || true

echo ""
echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager || true

echo ""
echo "=== Testing Local API ==="
curl -s http://localhost:3000/health || echo "⚠️ Local health check failed"

echo ""
echo "========================================"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "========================================"
echo ""
echo "🌐 Your API is available at:"
echo "   http://api.jacobtech.xyz"
echo "   https://api.jacobtech.xyz (after SSL)"
echo ""
echo "📚 API Documentation:"
echo "   https://api.jacobtech.xyz/docs"
echo ""
echo "🔧 Useful Commands:"
echo "   View API logs:   sudo journalctl -u $SERVICE_NAME -f"
echo "   View Nginx logs: sudo tail -f /var/log/nginx/access.log"
echo "   Restart API:     sudo systemctl restart $SERVICE_NAME"
echo "   Check status:    sudo systemctl status $SERVICE_NAME"
echo "   Update app:      ./deploy/update.sh"
echo ""
echo "📋 Next Steps:"
echo "   1. Point api.jacobtech.xyz A record to this server's public IP"
echo "   2. Wait for DNS propagation (up to 24 hours)"
echo ""
