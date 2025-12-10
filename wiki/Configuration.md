# Configuration Guide

Complete guide to configuring Astor AI for different environments and use cases.

## 📋 Environment Variables

### Database Configuration

```bash
# PostgreSQL
POSTGRES_USER=astro_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=astro_db
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Full connection URL
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
```

### Redis Configuration

```bash
# Redis connection
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=  # Optional

# Full connection URL
REDIS_URL=redis://${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}
```

### RabbitMQ Configuration

```bash
# RabbitMQ
RABBITMQ_DEFAULT_USER=astro
RABBITMQ_DEFAULT_PASS=your_rabbitmq_password
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_MANAGEMENT_PORT=15672

# Connection URL
RABBITMQ_URL=amqp://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}/
```

### JWT Authentication

```bash
# JWT Configuration
SECRET_KEY=your_secret_key_minimum_32_characters_long_random_string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

**Generate secure SECRET_KEY**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### API Keys

```bash
# OpenAI (for AI interpretations)
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000

# Alternative LLM Provider
LLM_PROVIDER=openai  # openai, anthropic, local
LLM_API_KEY=your-llm-key
LLM_API_BASE=https://api.openai.com/v1
```

### Payment Gateways

```bash
# Stripe
STRIPE_API_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CURRENCY=usd

# Razorpay (for India)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_CURRENCY=INR
```

### CORS Configuration

```bash
# Allowed origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:8000,https://yourdomain.com

# Allow credentials
CORS_ALLOW_CREDENTIALS=true

# Allowed methods
CORS_ALLOW_METHODS=GET,POST,PUT,DELETE,OPTIONS

# Allowed headers
CORS_ALLOW_HEADERS=*
```

### Application Settings

```bash
# Environment
ENVIRONMENT=development  # development, staging, production

# Debug mode
DEBUG=true  # false in production

# Logging
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_FORMAT=json  # json, text

# API
API_V1_PREFIX=/api/v1
PROJECT_NAME=Astor AI - Astrology Platform
VERSION=2.0.0
```

### File Upload Configuration

```bash
# Upload settings
MAX_UPLOAD_SIZE=10485760  # 10MB in bytes
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/jpg
UPLOAD_DIR=./uploads

# Storage provider
STORAGE_PROVIDER=local  # local, s3, gcs
```

### AWS S3 Configuration (Optional)

```bash
# AWS credentials
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=astro-uploads
S3_PUBLIC_URL=https://your-bucket.s3.amazonaws.com
```

### Email Configuration (Optional)

```bash
# SMTP settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@astroai.com
SMTP_TLS=true
```

### Rate Limiting

```bash
# Rate limit settings
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=100
RATE_LIMIT_BURST=20
```

## 📁 Configuration Files

### docker-compose.yml

Environment-specific compose files:
- `docker-compose.yml` - Base configuration
- `docker-compose.dev.yml` - Development overrides
- `docker-compose.prod.yml` - Production overrides

**Usage**:
```bash
# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### backend/app/core/config.py

Application configuration with Pydantic:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # OpenAI
    OPENAI_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### frontend/next.config.js

Next.js configuration:

```javascript
module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  images: {
    domains: ['localhost', 'your-cdn-domain.com'],
  },
}
```

## 🔧 Environment-Specific Configurations

### Development Environment

```bash
# .env.development
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=DEBUG

DATABASE_URL=postgresql://astro_user:dev_password@localhost:5432/astro_dev
REDIS_URL=redis://localhost:6379/0

# Relaxed security for development
CORS_ORIGINS=*
SECRET_KEY=dev-secret-key-not-for-production

# Mock external services
OPENAI_API_KEY=  # Empty for test mode
STRIPE_API_KEY=sk_test_...
```

### Staging Environment

```bash
# .env.staging
ENVIRONMENT=staging
DEBUG=false
LOG_LEVEL=INFO

DATABASE_URL=postgresql://astro_user:staging_password@db-staging:5432/astro_staging
REDIS_URL=redis://redis-staging:6379/0

# Actual CORS origins
CORS_ORIGINS=https://staging.astroai.com

# Test mode API keys
OPENAI_API_KEY=sk-test-...
STRIPE_API_KEY=sk_test_...
```

### Production Environment

```bash
# .env.production
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=WARNING

# Production database with SSL
DATABASE_URL=postgresql://astro_user:strong_password@db-prod.internal:5432/astro_prod?sslmode=require

# Redis with password
REDIS_URL=redis://:redis_password@redis-prod.internal:6379/0

# Strict CORS
CORS_ORIGINS=https://astroai.com,https://www.astroai.com

# Production API keys
OPENAI_API_KEY=sk-prod-...
STRIPE_API_KEY=sk_live_...

# Security
SECRET_KEY=very-long-random-secret-key-generated-securely
```

## 🗄️ Database Configuration

### PostgreSQL Settings

```bash
# In docker-compose.yml or postgresql.conf

# Connection settings
max_connections=100
shared_buffers=256MB
effective_cache_size=1GB

# Query tuning
work_mem=4MB
maintenance_work_mem=64MB

# WAL settings
wal_level=replica
max_wal_size=1GB
min_wal_size=80MB

# Checkpoint settings
checkpoint_timeout=15min
checkpoint_completion_target=0.9
```

### Connection Pooling (SQLAlchemy)

```python
# backend/app/core/database.py

engine = create_engine(
    DATABASE_URL,
    pool_size=20,              # Number of connections
    max_overflow=10,           # Additional connections
    pool_timeout=30,           # Seconds to wait for connection
    pool_recycle=3600,         # Recycle connections after 1 hour
    pool_pre_ping=True,        # Verify connections before use
    echo=False,                # Log SQL queries (debug only)
)
```

## 🔄 Redis Configuration

### Cache TTL Settings

```python
# Cache durations
CACHE_TTL_SHORT = 300        # 5 minutes
CACHE_TTL_MEDIUM = 3600      # 1 hour
CACHE_TTL_LONG = 86400       # 24 hours

# Specific cache keys
PANCHANG_CACHE_TTL = 3600    # Panchang data
CHART_CACHE_TTL = 86400      # Birth charts
PROFILE_CACHE_TTL = 900      # User profiles
```

### Redis Memory Management

```bash
# In redis.conf
maxmemory 512mb
maxmemory-policy allkeys-lru  # Evict least recently used keys
```

## 🚀 Performance Tuning

### Uvicorn Configuration

```bash
# Production settings
uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --loop uvloop \
  --http httptools \
  --log-level warning \
  --access-log \
  --proxy-headers \
  --forwarded-allow-ips='*'
```

### Next.js Build Configuration

```bash
# Production build
NODE_ENV=production npm run build

# Environment variables
NEXT_PUBLIC_API_URL=https://api.astroai.com
NEXT_TELEMETRY_DISABLED=1
```

## 🔐 Security Hardening

### Password Requirements

```python
# Minimum requirements
MIN_PASSWORD_LENGTH = 8
REQUIRE_UPPERCASE = True
REQUIRE_LOWERCASE = True
REQUIRE_DIGIT = True
REQUIRE_SPECIAL_CHAR = True
```

### Session Configuration

```python
# Session settings
SESSION_COOKIE_SECURE = True      # HTTPS only
SESSION_COOKIE_HTTPONLY = True    # No JavaScript access
SESSION_COOKIE_SAMESITE = "Lax"   # CSRF protection
SESSION_COOKIE_MAX_AGE = 86400    # 24 hours
```

## 📊 Monitoring Configuration

### Logging Configuration

```python
# backend/app/core/logging_config.py

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
            "format": "%(asctime)s %(name)s %(levelname)s %(message)s"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "json",
            "level": "INFO"
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "logs/app.log",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,
            "formatter": "json"
        }
    },
    "root": {
        "level": "INFO",
        "handlers": ["console", "file"]
    }
}
```

## ✅ Configuration Checklist

### Before Deployment

- [ ] Generate secure SECRET_KEY
- [ ] Set strong database passwords
- [ ] Configure production CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Configure production API keys
- [ ] Set DEBUG=false
- [ ] Configure backup strategy
- [ ] Set up monitoring
- [ ] Configure log rotation
- [ ] Test rate limiting
- [ ] Verify security headers
- [ ] Test error handling

---

**Next**: [Deployment Guide](Deployment-Guide) | [Security](Security)
