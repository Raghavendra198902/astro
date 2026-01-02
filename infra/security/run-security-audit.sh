#!/bin/bash

# ASTOR AI - Security Audit Script
# Automated security checks before production deployment
# Date: January 2, 2026

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Functions
log_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

log_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    ASTOR AI - Security Audit Runner           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Check Environment Variables
echo -e "${BLUE}[1/12] Checking Environment Variables...${NC}"

if [ "$ENVIRONMENT" = "production" ]; then
    log_pass "ENVIRONMENT set to production"
else
    log_fail "ENVIRONMENT not set to production: $ENVIRONMENT"
fi

if [ "$DEBUG" = "false" ] || [ "$DEBUG" = "False" ]; then
    log_pass "DEBUG mode disabled"
else
    log_fail "DEBUG mode is enabled!"
fi

if [ -z "$SECRET_KEY" ] || [ "$SECRET_KEY" = "dev-secret-key-change-in-production" ]; then
    log_fail "SECRET_KEY not set or using default value"
else
    log_pass "SECRET_KEY configured"
fi

# 2. Check SSL/TLS Configuration
echo -e "\n${BLUE}[2/12] Checking SSL/TLS Configuration...${NC}"

if [ -d "/etc/letsencrypt/live" ] && [ "$(ls -A /etc/letsencrypt/live)" ]; then
    log_pass "SSL certificates found"
else
    log_fail "SSL certificates not found"
fi

if systemctl is-active --quiet nginx; then
    log_pass "Nginx is running"
    
    # Test SSL configuration
    if nginx -t 2>&1 | grep -q "test is successful"; then
        log_pass "Nginx configuration valid"
    else
        log_fail "Nginx configuration has errors"
    fi
else
    log_warn "Nginx is not running"
fi

# 3. Check Database Security
echo -e "\n${BLUE}[3/12] Checking Database Security...${NC}"

if [ -n "$DB_PASSWORD" ] && [ ${#DB_PASSWORD} -ge 20 ]; then
    log_pass "Database password is strong (>=20 chars)"
else
    log_fail "Database password is weak or not set"
fi

# Check if PostgreSQL is listening on public interface
if netstat -tuln 2>/dev/null | grep -q ":5432.*0.0.0.0\|::"; then
    log_warn "PostgreSQL may be exposed to public internet"
else
    log_pass "PostgreSQL not exposed on public interface"
fi

# 4. Check Redis Security
echo -e "\n${BLUE}[4/12] Checking Redis Security...${NC}"

if [ -n "$REDIS_PASSWORD" ]; then
    log_pass "Redis password configured"
else
    log_warn "Redis password not set"
fi

if netstat -tuln 2>/dev/null | grep -q ":6379.*0.0.0.0\|::"; then
    log_warn "Redis may be exposed to public internet"
else
    log_pass "Redis not exposed on public interface"
fi

# 5. Check Firewall
echo -e "\n${BLUE}[5/12] Checking Firewall Configuration...${NC}"

if command -v ufw &> /dev/null; then
    if ufw status | grep -q "Status: active"; then
        log_pass "UFW firewall is active"
    else
        log_fail "UFW firewall is not active"
    fi
else
    log_warn "UFW not installed"
fi

# 6. Check Docker Security
echo -e "\n${BLUE}[6/12] Checking Docker Security...${NC}"

if docker ps &> /dev/null; then
    # Check if containers are running as root
    ROOT_CONTAINERS=$(docker ps --format "{{.Names}}" | while read container; do
        USER=$(docker exec "$container" whoami 2>/dev/null)
        if [ "$USER" = "root" ]; then
            echo "$container"
        fi
    done)
    
    if [ -z "$ROOT_CONTAINERS" ]; then
        log_pass "No containers running as root"
    else
        log_warn "Some containers running as root: $ROOT_CONTAINERS"
    fi
else
    log_warn "Docker not running or not accessible"
fi

# 7. Check for Secrets in Code
echo -e "\n${BLUE}[7/12] Scanning for Exposed Secrets...${NC}"

cd "$(dirname "$0")/../.."

# Check for common secret patterns
SECRETS_FOUND=0

if grep -r "password.*=.*['\"]" backend/ frontend/ --include="*.py" --include="*.js" --include="*.ts" | grep -v "password.*input\|password.*field\|test"; then
    log_fail "Possible hardcoded passwords found"
    SECRETS_FOUND=1
fi

if grep -r "api_key.*=.*['\"]" backend/ frontend/ --include="*.py" --include="*.js" --include="*.ts" | grep -v "test"; then
    log_fail "Possible hardcoded API keys found"
    SECRETS_FOUND=1
fi

if [ $SECRETS_FOUND -eq 0 ]; then
    log_pass "No obvious secrets found in code"
fi

# 8. Check Dependency Vulnerabilities
echo -e "\n${BLUE}[8/12] Checking Dependencies for Vulnerabilities...${NC}"

# Python dependencies
if [ -f "backend/requirements.txt" ]; then
    cd backend
    if command -v safety &> /dev/null; then
        if safety check --json > /dev/null 2>&1; then
            log_pass "No Python dependency vulnerabilities found"
        else
            log_fail "Python dependency vulnerabilities found"
        fi
    else
        log_warn "Safety not installed, skipping Python dependency check"
    fi
    cd ..
fi

# Node.js dependencies
if [ -f "frontend/package.json" ]; then
    cd frontend
    if npm audit --audit-level=high > /dev/null 2>&1; then
        log_pass "No critical NPM vulnerabilities found"
    else
        log_warn "NPM vulnerabilities found, run 'npm audit' for details"
    fi
    cd ..
fi

# 9. Check Backup Configuration
echo -e "\n${BLUE}[9/12] Checking Backup Configuration...${NC}"

if [ -f "infra/backup/backup-database.sh" ]; then
    log_pass "Database backup script exists"
    
    # Check if backup is scheduled
    if crontab -l 2>/dev/null | grep -q "backup-database.sh"; then
        log_pass "Database backup is scheduled"
    else
        log_warn "Database backup not scheduled in crontab"
    fi
else
    log_fail "Database backup script not found"
fi

# 10. Check Logging Configuration
echo -e "\n${BLUE}[10/12] Checking Logging Configuration...${NC}"

if [ -d "backend/logs" ] || grep -q "LOG_LEVEL" backend/.env 2>/dev/null; then
    log_pass "Logging configured"
else
    log_warn "Logging configuration not found"
fi

# Check if Sentry is configured
if grep -q "SENTRY_DSN" backend/.env 2>/dev/null; then
    log_pass "Sentry error tracking configured"
else
    log_warn "Sentry not configured"
fi

# 11. Check Rate Limiting
echo -e "\n${BLUE}[11/12] Checking Rate Limiting...${NC}"

if grep -q "limit_req_zone" infra/nginx/nginx.conf 2>/dev/null; then
    log_pass "Rate limiting configured in Nginx"
else
    log_warn "Rate limiting not found in Nginx config"
fi

# 12. Check CORS Configuration
echo -e "\n${BLUE}[12/12] Checking CORS Configuration...${NC}"

if grep -q "CORS" backend/app/main.py 2>/dev/null; then
    log_pass "CORS middleware found"
    
    # Check if CORS is not set to allow all origins
    if grep -q "allow_origins.*\[\"*\"\]" backend/app/main.py 2>/dev/null; then
        log_fail "CORS allows all origins (wildcard)"
    else
        log_pass "CORS properly restricted"
    fi
else
    log_warn "CORS configuration not found"
fi

# Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Audit Summary                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo -e "${GREEN}Passed:${NC}   $PASSED"
echo -e "${RED}Failed:${NC}   $FAILED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Security audit passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Security audit failed with $FAILED critical issues${NC}"
    echo -e "${YELLOW}Please fix critical issues before deploying to production${NC}"
    exit 1
fi
