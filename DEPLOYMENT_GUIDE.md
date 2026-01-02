# 🚀 ASTOR AI - Production Deployment Guide

**Version**: 5.1.0  
**Last Updated**: January 2, 2026  
**Deployment Target**: Production Server

---

## 📋 Quick Reference

### **Week 1 Implementation Status** ✅

- ✅ **Day 1-2**: SSL/TLS Setup - Complete
- ✅ **Day 3-4**: Backup Implementation - Complete  
- ✅ **Day 5-6**: CI/CD Pipeline - Complete
- ✅ **Day 7**: Security Audit - Complete

### **Created Files** (15 files)

#### **SSL/TLS** (`/infra/ssl/`)
- `setup-ssl.sh` - Automated SSL certificate setup with Let's Encrypt

#### **Nginx** (`/infra/nginx/`)
- `nginx.conf` - Production nginx configuration with SSL, rate limiting, security headers

#### **Backup** (`/infra/backup/`)
- `backup-database.sh` - PostgreSQL automated backup with S3 upload
- `backup-redis.sh` - Redis backup script with compression
- `restore-database.sh` - Database restoration utility

#### **CI/CD** (`/.github/workflows/`)
- `backend-ci.yml` - Backend CI/CD pipeline (lint, test, build, deploy)
- `frontend-ci.yml` - Frontend CI/CD pipeline (lint, test, E2E, deploy)
- `security-audit.yml` - Automated security scanning
- `backup-database.yml` - Scheduled database backups

#### **Security** (`/infra/security/`)
- `SECURITY_CHECKLIST.md` - Comprehensive 200+ point security checklist
- `run-security-audit.sh` - Automated security audit script

#### **Configuration**
- `.env.production.template` - Production environment variables template

---

## 🎯 Deployment Steps

### **Prerequisites**

- Ubuntu 20.04+ / Debian 11+ server
- Docker & Docker Compose installed
- Domain name configured (astorai.com)
- DNS records pointing to server
- Sudo access

### **Step 1: Server Setup** (30 minutes)

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Install prerequisites
sudo apt install -y nginx certbot python3-certbot-nginx postgresql-client redis-tools

# 5. Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### **Step 2: SSL/TLS Setup** (20 minutes)

```bash
# 1. Run SSL setup script
sudo ./infra/ssl/setup-ssl.sh astorai.com admin@astorai.com

# 2. Verify SSL certificates
sudo certbot certificates

# 3. Test SSL configuration
sudo nginx -t
sudo systemctl reload nginx

# 4. Check SSL rating
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=astorai.com
```

### **Step 3: Environment Configuration** (15 minutes)

```bash
# 1. Copy environment template
cp .env.production.template .env

# 2. Generate strong secrets
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
openssl rand -base64 24  # For DB_PASSWORD

# 3. Edit .env file with real values
nano .env

# 4. Verify no secrets in git
git status --ignored
# Ensure .env is in .gitignore
```

### **Step 4: Deploy Application** (20 minutes)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/astor-ai.git /opt/astor-ai
cd /opt/astor-ai

# 2. Copy nginx config
sudo cp infra/nginx/nginx.conf /etc/nginx/sites-available/astor-ai
sudo ln -s /etc/nginx/sites-available/astor-ai /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default

# 3. Start services
docker-compose up -d

# 4. Run database migrations
docker-compose exec backend alembic upgrade head

# 5. Create admin user (optional)
docker-compose exec backend python -m app.scripts.create_admin

# 6. Test services
curl http://localhost:8000/api/v1/healthz
curl http://localhost:3000/health
```

### **Step 5: Setup Backups** (15 minutes)

```bash
# 1. Create backup directories
sudo mkdir -p /var/backups/astor-ai/{postgresql,redis}

# 2. Configure backup scripts
sudo cp infra/backup/*.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/backup-*.sh

# 3. Schedule backups
sudo crontab -e

# Add these lines:
0 2 * * * /usr/local/bin/backup-database.sh
0 3 * * * /usr/local/bin/backup-redis.sh

# 4. Test backup
sudo /usr/local/bin/backup-database.sh

# 5. Configure S3 (optional)
aws configure  # Enter AWS credentials
```

### **Step 6: Configure Monitoring** (20 minutes)

```bash
# 1. Setup Prometheus (optional)
docker-compose -f docker-compose.monitoring.yml up -d

# 2. Configure Grafana dashboards
# Access: http://your-server:3001
# Import dashboards from /infra/monitoring/dashboards/

# 3. Configure Sentry
# Add SENTRY_DSN to .env file

# 4. Test error reporting
docker-compose exec backend python -c "raise Exception('Test error')"
# Check Sentry dashboard
```

### **Step 7: Security Audit** (10 minutes)

```bash
# 1. Run security audit
./infra/security/run-security-audit.sh

# 2. Review security checklist
# Open: infra/security/SECURITY_CHECKLIST.md

# 3. Fix any critical issues found

# 4. Run penetration tests (optional)
# Use OWASP ZAP or Burp Suite
```

### **Step 8: Final Verification** (15 minutes)

```bash
# 1. Health checks
curl https://api.astorai.com/api/v1/healthz
curl https://astorai.com/health

# 2. Test SSL
curl -I https://api.astorai.com | grep -i "strict-transport-security"

# 3. Test authentication
curl -X POST https://api.astorai.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'

# 4. Test rate limiting
for i in {1..150}; do curl https://api.astorai.com/api/v1/healthz; done

# 5. Verify backups
ls -lh /var/backups/astor-ai/postgresql/daily/

# 6. Check logs
docker-compose logs -f --tail=100
```

---

## 🔧 CI/CD Setup

### **GitHub Secrets Configuration**

Add these secrets to your GitHub repository:

```bash
# Repository Settings > Secrets and variables > Actions

# Server Access
STAGING_HOST=staging.astorai.com
STAGING_USER=deploy
STAGING_SSH_KEY=<private-key-content>

PRODUCTION_HOST=astorai.com
PRODUCTION_USER=deploy
PRODUCTION_SSH_KEY=<private-key-content>

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=astor_ai
DB_USER=astor_user
DB_PASSWORD=<strong-password>

# AWS (for backups)
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_REGION=us-east-1

# API URL
API_URL=https://api.astorai.com
```

### **Trigger Deployments**

```bash
# Deploy to staging
git push origin staging

# Deploy to production
git push origin main

# Manual security audit
# Go to Actions > Security Audit > Run workflow
```

---

## 📊 Monitoring & Maintenance

### **Daily Checks**
- [ ] Check service health: `docker-compose ps`
- [ ] Review logs: `docker-compose logs --tail=100`
- [ ] Monitor disk space: `df -h`
- [ ] Check backup status: `ls -lh /var/backups/astor-ai/`

### **Weekly Checks**
- [ ] Review Sentry errors
- [ ] Check SSL certificate expiry: `certbot certificates`
- [ ] Review audit logs
- [ ] Update dependencies

### **Monthly Checks**
- [ ] Test backup restoration
- [ ] Security scan: `./infra/security/run-security-audit.sh`
- [ ] Performance review
- [ ] Access audit (remove old accounts)

---

## 🚨 Troubleshooting

### **SSL Certificate Issues**

```bash
# Check certificate status
sudo certbot certificates

# Renew manually
sudo certbot renew --dry-run
sudo certbot renew --force-renewal

# Check nginx config
sudo nginx -t
```

### **Database Connection Issues**

```bash
# Check PostgreSQL status
docker-compose ps postgres

# Connect to database
docker-compose exec postgres psql -U astor_user -d astor_ai

# Check connections
docker-compose exec postgres psql -U astor_user -d astor_ai -c "SELECT * FROM pg_stat_activity;"
```

### **Service Not Starting**

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart

# Rebuild if needed
docker-compose up -d --build
```

### **Backup Restoration**

```bash
# Restore from backup
sudo /usr/local/bin/restore-database.sh /var/backups/astor-ai/postgresql/daily/daily_20260102_020000.sql.gz

# Restart services
docker-compose restart backend
```

---

## 📞 Support & Contact

**Technical Issues**: Create issue on GitHub  
**Security Issues**: security@astorai.com  
**General Support**: support@astorai.com

---

## ✅ Deployment Checklist

- [ ] Server provisioned and configured
- [ ] SSL certificates installed and working
- [ ] Environment variables configured
- [ ] Application deployed and running
- [ ] Database migrations applied
- [ ] Backups configured and tested
- [ ] Monitoring setup complete
- [ ] Security audit passed
- [ ] Health checks passing
- [ ] CI/CD pipeline configured
- [ ] Documentation reviewed
- [ ] Team trained on operations

**Deployed by**: _________________  
**Date**: _________________  
**Version**: 5.1.0

---

**🎉 Congratulations! ASTOR AI is now live in production!**
