# 🔒 ASTOR AI - Production Security Checklist

**Last Updated**: January 2, 2026  
**Version**: 1.0  
**Target Environment**: Production

---

## 📋 Pre-Deployment Security Checklist

### 1. **SSL/TLS Configuration** ✅

- [ ] SSL certificates obtained (Let's Encrypt or commercial)
- [ ] HTTPS enabled for all domains (main, www, api)
- [ ] HTTP to HTTPS redirect configured
- [ ] TLS 1.2+ enforced (no TLS 1.0/1.1)
- [ ] Strong cipher suites configured
- [ ] OCSP stapling enabled
- [ ] HSTS header configured (max-age=31536000)
- [ ] SSL certificate auto-renewal setup (certbot cron)
- [ ] Test with SSL Labs (Grade A or A+): https://www.ssllabs.com/ssltest/

**Script**: `/infra/ssl/setup-ssl.sh`

---

### 2. **API Security** 🔐

- [ ] Rate limiting enabled (100 req/min for API, 5 req/min for auth)
- [ ] CORS properly configured (whitelist only trusted origins)
- [ ] JWT tokens with short expiry (30 min access, 7 days refresh)
- [ ] Password hashing with Argon2
- [ ] Input validation on all endpoints (Pydantic schemas)
- [ ] SQL injection protection (ORM-based queries only)
- [ ] XSS protection headers enabled
- [ ] CSRF protection for state-changing operations
- [ ] API versioning in use (/api/v1/)
- [ ] Request size limits (10MB frontend, 20MB API)
- [ ] Timeout limits configured (60s default)

**Files to Review**:
- `backend/app/core/security.py`
- `backend/app/core/config.py`
- `infra/nginx/nginx.conf`

---

### 3. **Authentication & Authorization** 👤

- [ ] OAuth2 password flow implemented
- [ ] Role-based access control (RBAC) enforced
- [ ] Account lockout after failed login attempts
- [ ] Email verification required for new accounts
- [ ] Password strength requirements (min 8 chars, complexity)
- [ ] Secure password reset flow
- [ ] Session management with Redis
- [ ] Logout invalidates all active tokens
- [ ] Multi-factor authentication (2FA) ready (optional)

**Test Accounts Disabled**:
- [ ] Remove or disable demo accounts in production
- [ ] seeker@demo.com / demo1234 ❌
- [ ] astrologer@demo.com / demo1234 ❌

---

### 4. **Database Security** 🗄️

- [ ] PostgreSQL not exposed to public internet
- [ ] Strong database passwords (min 20 chars)
- [ ] Database user with minimal privileges
- [ ] Connection pooling configured (PgBouncer)
- [ ] Automated backups enabled (daily)
- [ ] Backup encryption enabled
- [ ] Point-in-time recovery (PITR) configured
- [ ] Database SSL connections enforced
- [ ] Audit logging enabled
- [ ] Regular VACUUM and ANALYZE scheduled

**Backup Scripts**:
- `infra/backup/backup-database.sh`
- `infra/backup/restore-database.sh`

---

### 5. **Redis Security** 🔴

- [ ] Redis not exposed to public internet
- [ ] Redis password authentication enabled
- [ ] Redis persistence configured (RDB + AOF)
- [ ] Redis backup script scheduled
- [ ] Rename dangerous commands (FLUSHDB, FLUSHALL, CONFIG)
- [ ] Memory limits configured
- [ ] Connection limits set

**Configuration**: `docker-compose.yml` (redis service)

---

### 6. **Application Security** 🛡️

- [ ] Debug mode disabled in production
- [ ] Stack traces hidden from users
- [ ] Error messages sanitized (no sensitive data)
- [ ] File upload restrictions (type, size)
- [ ] Biometric data auto-deletion (24 hours)
- [ ] User data encryption at rest
- [ ] Sensitive environment variables in secrets manager
- [ ] API keys rotated regularly
- [ ] Dependency vulnerabilities patched

**Environment Variables to Secure**:
```bash
SECRET_KEY=<strong-random-key>
JWT_SECRET_KEY=<strong-random-key>
DB_PASSWORD=<strong-password>
REDIS_PASSWORD=<strong-password>
OPENAI_API_KEY=<secret>
STRIPE_SECRET_KEY=<secret>
RAZORPAY_KEY_SECRET=<secret>
```

---

### 7. **Network Security** 🌐

- [ ] Firewall configured (UFW/iptables)
  - Allow: 22 (SSH - restricted IPs), 80 (HTTP), 443 (HTTPS)
  - Deny: All other inbound traffic
- [ ] DDoS protection enabled (Cloudflare/AWS Shield)
- [ ] Web Application Firewall (WAF) configured
- [ ] VPC/private network for internal services
- [ ] No direct access to backend/database from internet
- [ ] SSH key-based authentication only (no passwords)
- [ ] Fail2ban or similar brute-force protection

---

### 8. **Container Security** 🐳

- [ ] Docker images from official sources only
- [ ] No secrets in Dockerfiles or images
- [ ] Non-root user in containers
- [ ] Resource limits configured (CPU, memory)
- [ ] Health checks configured
- [ ] Image scanning enabled (Trivy)
- [ ] Regular image updates
- [ ] Docker socket not exposed
- [ ] Container restart policies configured

**Review**: `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile.dev`

---

### 9. **Logging & Monitoring** 📊

- [ ] Centralized logging (ELK Stack or CloudWatch)
- [ ] Audit trail for critical operations
- [ ] Failed login attempts logged
- [ ] API access logs enabled
- [ ] Error tracking (Sentry) configured
- [ ] Performance monitoring (Prometheus/Grafana)
- [ ] Alerts for security events
- [ ] Log retention policy (90 days minimum)
- [ ] PII/sensitive data excluded from logs

**Configuration**:
- `backend/app/core/logging_config.py`
- `backend/app/services/audit/audit_logger.py`

---

### 10. **Secrets Management** 🔑

- [ ] No hardcoded secrets in code
- [ ] Environment variables for all secrets
- [ ] Secrets stored in vault (HashiCorp Vault/AWS Secrets Manager)
- [ ] Secrets rotation policy (90 days)
- [ ] Different secrets for dev/staging/production
- [ ] .env files in .gitignore
- [ ] Git history checked for leaked secrets

**Tools**: TruffleHog, git-secrets

---

### 11. **Compliance & Privacy** ⚖️

- [ ] GDPR compliance implemented
  - [ ] User consent management
  - [ ] Data export functionality
  - [ ] Data deletion (right to be forgotten)
  - [ ] Privacy policy updated
  - [ ] Cookie consent banner
- [ ] Biometric data retention (24 hours max)
- [ ] Terms of service accepted on signup
- [ ] Data encryption at rest
- [ ] Data encryption in transit
- [ ] Third-party data sharing disclosed

---

### 12. **Backup & Recovery** 💾

- [ ] Automated daily backups
- [ ] Backup verification (restore tests)
- [ ] Off-site backup storage (S3/cloud)
- [ ] Backup encryption enabled
- [ ] Disaster recovery plan documented
- [ ] RTO (Recovery Time Objective) < 4 hours
- [ ] RPO (Recovery Point Objective) < 24 hours
- [ ] Backup restoration tested monthly

**Scripts**: `/infra/backup/`

---

### 13. **Third-Party Security** 🔌

- [ ] API keys for third-party services secured
- [ ] OAuth scopes minimized
- [ ] Webhook signatures verified
- [ ] Third-party API rate limits respected
- [ ] Vendor security assessments completed
- [ ] SLAs reviewed

**Third-Party Services**:
- OpenAI/Anthropic (AI)
- Stripe/Razorpay (Payments)
- SendGrid/SMTP (Email)
- Sentry (Monitoring)
- AWS S3 (Storage)

---

### 14. **Code Security** 💻

- [ ] No commented-out sensitive code
- [ ] Input validation on all user inputs
- [ ] Output encoding to prevent XSS
- [ ] Parameterized queries (no string concatenation)
- [ ] Safe deserialization practices
- [ ] File upload validation
- [ ] Path traversal protection
- [ ] Regular security code reviews

**Tools**:
- Bandit (Python security)
- ESLint security plugins
- Semgrep (SAST)

---

### 15. **Dependency Management** 📦

- [ ] All dependencies up to date
- [ ] Known vulnerabilities patched
- [ ] Automated dependency updates (Dependabot)
- [ ] License compliance verified
- [ ] Unused dependencies removed
- [ ] Security advisories monitored

**Commands**:
```bash
# Python
pip install safety
safety check

# Node.js
npm audit fix
```

---

## 🚨 Critical Security Actions (Before Going Live)

1. **Change All Default Passwords**
   - Database passwords
   - Redis passwords
   - Admin accounts
   - API keys

2. **Disable Debug Mode**
   ```bash
   # backend/.env
   DEBUG=false
   ENVIRONMENT=production
   ```

3. **Remove Demo Accounts**
   ```bash
   cd backend
   python -m app.scripts.remove_demo_users
   ```

4. **SSL Certificate Installation**
   ```bash
   sudo /infra/ssl/setup-ssl.sh astorai.com admin@astorai.com
   ```

5. **Configure Firewall**
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

6. **Enable Automated Backups**
   ```bash
   # Add to crontab
   0 2 * * * /infra/backup/backup-database.sh
   0 3 * * * /infra/backup/backup-redis.sh
   ```

7. **Security Scan**
   ```bash
   # Run comprehensive security audit
   cd backend
   bandit -r app/ -ll
   safety check
   
   cd ../frontend
   npm audit
   ```

---

## 🧪 Security Testing

### Penetration Testing
- [ ] SQL injection tests
- [ ] XSS vulnerability tests
- [ ] CSRF protection tests
- [ ] Authentication bypass tests
- [ ] Authorization tests
- [ ] Rate limiting tests
- [ ] File upload security tests

### Automated Security Scans
- [ ] OWASP ZAP scan
- [ ] Burp Suite scan
- [ ] Nikto scan
- [ ] SSL Labs test
- [ ] SecurityHeaders.com check

---

## 📈 Security Monitoring (Post-Launch)

### Daily
- [ ] Review failed login attempts
- [ ] Check error logs for anomalies
- [ ] Monitor API rate limiting hits

### Weekly
- [ ] Review audit logs
- [ ] Check backup success status
- [ ] Review Sentry error reports
- [ ] Monitor system resource usage

### Monthly
- [ ] Security patches applied
- [ ] Dependency updates
- [ ] Access review (remove old accounts)
- [ ] Backup restoration test
- [ ] Security scan

### Quarterly
- [ ] Penetration testing
- [ ] Security policy review
- [ ] Vendor security assessments
- [ ] Incident response drill

---

## 🆘 Incident Response Plan

### 1. Detection
- Monitor alerts from Sentry, Prometheus
- User reports
- Security scan findings

### 2. Containment
- Isolate affected systems
- Block malicious IPs
- Disable compromised accounts

### 3. Investigation
- Review logs
- Identify attack vector
- Assess impact

### 4. Remediation
- Patch vulnerabilities
- Rotate compromised secrets
- Restore from clean backup if needed

### 5. Communication
- Notify affected users
- Report to authorities if required (GDPR)
- Update security measures

### 6. Post-Incident
- Root cause analysis
- Update security procedures
- Implement preventive measures

---

## ✅ Sign-Off

**Security Lead**: _________________  
**Date**: _________________  

**DevOps Lead**: _________________  
**Date**: _________________  

**CTO/Technical Lead**: _________________  
**Date**: _________________  

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [GDPR Compliance Guide](https://gdpr.eu/)

---

**Last Review**: January 2, 2026  
**Next Review**: April 2, 2026 (Quarterly)
