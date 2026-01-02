#!/bin/bash

# ASTOR AI - SSL/TLS Setup Script with Let's Encrypt
# Automates SSL certificate generation and renewal
# Date: January 2, 2026

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ASTOR AI - SSL/TLS Certificate Setup        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Configuration
DOMAIN="${1:-astorai.com}"
EMAIL="${2:-admin@astorai.com}"
STAGING="${3:-false}"  # Use staging for testing
WEBROOT="/var/www/certbot"

echo -e "${BLUE}Configuration:${NC}"
echo -e "  Domain: ${GREEN}${DOMAIN}${NC}"
echo -e "  Email: ${GREEN}${EMAIL}${NC}"
echo -e "  Staging: ${YELLOW}${STAGING}${NC}"
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}Error: This script must be run as root${NC}" 
   exit 1
fi

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Installing Certbot...${NC}"
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✓ Certbot installed${NC}"
else
    echo -e "${GREEN}✓ Certbot already installed${NC}"
fi

# Create webroot directory
mkdir -p "$WEBROOT"
echo -e "${GREEN}✓ Webroot directory created${NC}"

# Stop nginx if running (to free port 80)
if systemctl is-active --quiet nginx; then
    echo -e "${YELLOW}Stopping nginx temporarily...${NC}"
    systemctl stop nginx
fi

# Certbot command
CERTBOT_CMD="certbot certonly"

if [ "$STAGING" = "true" ]; then
    CERTBOT_CMD="$CERTBOT_CMD --staging"
    echo -e "${YELLOW}⚠ Using Let's Encrypt staging environment${NC}"
fi

# Request certificate
echo -e "${BLUE}Requesting SSL certificate...${NC}"

$CERTBOT_CMD \
    --standalone \
    --preferred-challenges http \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    -d "api.$DOMAIN"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL certificate obtained successfully!${NC}"
else
    echo -e "${RED}✗ Failed to obtain SSL certificate${NC}"
    exit 1
fi

# Set up automatic renewal
echo -e "${BLUE}Setting up automatic certificate renewal...${NC}"

# Create renewal hook script
cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh << 'EOF'
#!/bin/bash
# Reload nginx after certificate renewal
systemctl reload nginx
echo "Nginx reloaded after certificate renewal"
EOF

chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

# Add cron job for automatic renewal (runs twice daily)
CRON_CMD="0 0,12 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'"

if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
    (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
    echo -e "${GREEN}✓ Cron job added for automatic renewal${NC}"
else
    echo -e "${GREEN}✓ Renewal cron job already exists${NC}"
fi

# Test automatic renewal (dry run)
echo -e "${BLUE}Testing automatic renewal...${NC}"
certbot renew --dry-run

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Automatic renewal test passed${NC}"
else
    echo -e "${YELLOW}⚠ Automatic renewal test failed (may need manual intervention)${NC}"
fi

# Display certificate information
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Certificate Information                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
certbot certificates

# Start nginx
echo ""
echo -e "${BLUE}Starting nginx...${NC}"
systemctl start nginx
systemctl enable nginx

if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx started successfully${NC}"
else
    echo -e "${RED}✗ Failed to start nginx${NC}"
    echo -e "${YELLOW}Check nginx configuration: nginx -t${NC}"
    exit 1
fi

# Final instructions
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Setup Complete! ✓                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Certificate Details:${NC}"
echo -e "  Location: ${GREEN}/etc/letsencrypt/live/$DOMAIN/${NC}"
echo -e "  Fullchain: ${GREEN}fullchain.pem${NC}"
echo -e "  Private Key: ${GREEN}privkey.pem${NC}"
echo -e "  Valid for: ${GREEN}90 days${NC}"
echo -e "  Auto-renewal: ${GREEN}Enabled (twice daily)${NC}"
echo ""
echo -e "${BLUE}Your sites:${NC}"
echo -e "  ${GREEN}https://$DOMAIN${NC}"
echo -e "  ${GREEN}https://www.$DOMAIN${NC}"
echo -e "  ${GREEN}https://api.$DOMAIN${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Update nginx configuration to use SSL certificates"
echo -e "  2. Test HTTPS access to all domains"
echo -e "  3. Check SSL rating: https://www.ssllabs.com/ssltest/"
echo -e "  4. Monitor renewal: journalctl -u certbot.timer"
echo ""
