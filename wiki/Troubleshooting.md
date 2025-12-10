# Troubleshooting Guide

Common issues and solutions for Astor AI.

## 🔍 Quick Diagnostics

### Health Check Commands

```bash
# Check all containers
docker ps

# Backend health
curl http://localhost:8000/health

# Database connection
docker exec astor-postgres pg_isready -U astro_user

# Redis connection
docker exec astor-redis redis-cli ping

# View recent logs
docker-compose logs --tail=50 backend
```

## 🐛 Common Issues

### 1. Backend Won't Start

**Symptom**: Backend container exits immediately

**Diagnosis**:
```bash
# Check container logs
docker logs astor-backend

# Check if port is in use
sudo lsof -i :8000

# Verify environment variables
docker exec astor-backend env | grep DATABASE_URL
```

**Solutions**:

- **Database connection failed**:
  ```bash
  # Restart PostgreSQL
  docker restart astor-postgres
  
  # Verify credentials in .env
  grep POSTGRES .env
  ```

- **Missing dependencies**:
  ```bash
  # Rebuild backend
  docker-compose build backend --no-cache
  docker-compose up -d backend
  ```

- **Port already in use**:
  ```bash
  # Kill process using port 8000
  sudo kill -9 $(sudo lsof -t -i:8000)
  ```

### 2. Frontend Build Errors

**Symptom**: Frontend container fails to build or crashes

**Diagnosis**:
```bash
# Check frontend logs
docker logs astor-frontend

# Check Node.js version
docker exec astor-frontend node --version
```

**Solutions**:

- **Dependency issues**:
  ```bash
  cd frontend
  rm -rf node_modules package-lock.json .next
  npm install
  ```

- **Build memory issue**:
  ```bash
  # Increase Node.js memory
  NODE_OPTIONS="--max-old-space-size=4096" npm run build
  ```

- **Port 3000 in use**:
  ```bash
  sudo kill -9 $(sudo lsof -t -i:3000)
  ```

### 3. Database Connection Errors

**Symptom**: `connection refused` or `password authentication failed`

**Diagnosis**:
```bash
# Test database connection
docker exec astor-postgres psql -U astro_user -d astro_db -c "SELECT 1"

# Check PostgreSQL status
docker exec astor-postgres pg_isready
```

**Solutions**:

- **Wrong credentials**:
  ```bash
  # Verify .env file
  cat .env | grep POSTGRES
  
  # Reset password
  docker exec astor-postgres psql -U postgres -c "ALTER USER astro_user WITH PASSWORD 'new_password';"
  ```

- **Database doesn't exist**:
  ```bash
  # Create database
  docker exec astor-postgres psql -U postgres -c "CREATE DATABASE astro_db;"
  ```

- **Too many connections**:
  ```bash
  # Check active connections
  docker exec astor-postgres psql -U astro_user -d astro_db -c "SELECT count(*) FROM pg_stat_activity;"
  
  # Kill idle connections
  docker exec astor-postgres psql -U astro_user -d astro_db -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle';"
  ```

### 4. Migration Failures

**Symptom**: Alembic migrations fail

**Diagnosis**:
```bash
# Check migration status
docker exec astor-backend alembic current

# View migration history
docker exec astor-backend alembic history
```

**Solutions**:

- **Downgrade and retry**:
  ```bash
  # Downgrade one version
  docker exec astor-backend alembic downgrade -1
  
  # Upgrade again
  docker exec astor-backend alembic upgrade head
  ```

- **Reset migrations** (DESTRUCTIVE):
  ```bash
  # Backup database first!
  docker exec astor-postgres pg_dump -U astro_user astro_db > backup.sql
  
  # Drop and recreate
  docker exec astor-postgres psql -U postgres -c "DROP DATABASE astro_db;"
  docker exec astor-postgres psql -U postgres -c "CREATE DATABASE astro_db;"
  
  # Run migrations
  docker exec astor-backend alembic upgrade head
  ```

### 5. Redis Connection Issues

**Symptom**: `redis.exceptions.ConnectionError`

**Diagnosis**:
```bash
# Test Redis
docker exec astor-redis redis-cli ping

# Check Redis logs
docker logs astor-redis
```

**Solutions**:

- **Redis not running**:
  ```bash
  # Restart Redis
  docker restart astor-redis
  ```

- **Wrong Redis URL**:
  ```bash
  # Verify URL
  echo $REDIS_URL
  
  # Should be: redis://redis:6379/0
  ```

### 6. Authentication Errors

**Symptom**: `401 Unauthorized` or `Could not validate credentials`

**Solutions**:

- **Token expired**:
  ```bash
  # Get new token
  curl -X POST http://localhost:8000/api/v1/auth/login \
    -d "username=user@example.com&password=password"
  ```

- **Invalid SECRET_KEY**:
  ```bash
  # Generate new key
  python -c "import secrets; print(secrets.token_urlsafe(32))"
  
  # Update .env
  SECRET_KEY=new_generated_key
  
  # Restart backend
  docker-compose restart backend
  ```

### 7. Chart Generation Fails

**Symptom**: `500 Internal Server Error` when generating charts

**Diagnosis**:
```bash
# Check Swiss Ephemeris data
docker exec astor-backend ls -la app/services/chart/ephemeris/data/

# Test chart calculation
docker exec astor-backend python -c "import swisseph as swe; print(swe.version)"
```

**Solutions**:

- **Missing ephemeris files**:
  ```bash
  # Download ephemeris data
  cd backend/app/services/chart/ephemeris/data/
  wget ftp://ftp.astro.com/pub/swisseph/ephe/*.se1
  ```

- **Invalid coordinates**:
  - Ensure latitude is between -90 and 90
  - Ensure longitude is between -180 and 180

### 8. Payment Integration Issues

**Symptom**: Payment webhooks not received

**Solutions**:

- **Development testing**:
  ```bash
  # Use ngrok for local webhook testing
  ngrok http 8000
  
  # Update webhook URL in Stripe dashboard
  # https://your-ngrok-url.ngrok.io/api/v1/payments/webhook
  ```

- **Verify webhook secret**:
  ```bash
  # Check environment variable
  echo $STRIPE_WEBHOOK_SECRET
  ```

### 9. High Memory Usage

**Symptom**: Containers using excessive memory

**Diagnosis**:
```bash
# Check memory usage
docker stats

# Check system memory
free -h
```

**Solutions**:

- **Limit container memory**:
  ```yaml
  # In docker-compose.yml
  services:
    backend:
      mem_limit: 1g
      mem_reservation: 512m
  ```

- **Clear cache**:
  ```bash
  # Clear Redis cache
  docker exec astor-redis redis-cli FLUSHALL
  ```

### 10. Slow API Response

**Symptom**: API requests take >5 seconds

**Diagnosis**:
```bash
# Time API request
time curl http://localhost:8000/api/v1/panchang

# Check database slow queries
docker exec astor-postgres psql -U astro_user -d astro_db -c "SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

**Solutions**:

- **Enable caching**:
  ```bash
  # Verify Redis is running
  docker ps | grep redis
  
  # Test cache
  curl http://localhost:8000/api/v1/panchang  # First request (slow)
  curl http://localhost:8000/api/v1/panchang  # Second request (fast)
  ```

- **Optimize database queries**:
  ```bash
  # Verify indexes
  docker exec astor-postgres psql -U astro_user -d astro_db -c "\di"
  ```

## 🔧 Advanced Troubleshooting

### Enable Debug Logging

```bash
# Edit .env
DEBUG=true
LOG_LEVEL=DEBUG

# Restart backend
docker-compose restart backend

# Watch logs
docker-compose logs -f backend
```

### Database Debugging

```bash
# Connect to PostgreSQL
docker exec -it astor-postgres psql -U astro_user -d astro_db

# List tables
\dt

# Describe table
\d users

# Check table size
SELECT pg_size_pretty(pg_total_relation_size('users'));

# Active queries
SELECT pid, query, state FROM pg_stat_activity WHERE state != 'idle';
```

### Network Issues

```bash
# Test container connectivity
docker exec astor-backend ping postgres
docker exec astor-backend ping redis

# Check Docker networks
docker network ls
docker network inspect astro_default
```

### Clean Slate Restart

```bash
# Stop everything
docker-compose down -v

# Remove containers and images
docker-compose down --rmi all -v

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d

# Run migrations
docker exec astor-backend alembic upgrade head
```

## 📞 Getting Help

### Collect Diagnostics

```bash
# Create diagnostic report
cat > diagnostics.txt << EOF
=== Docker Containers ===
$(docker ps -a)

=== Backend Logs ===
$(docker logs astor-backend --tail=100)

=== Database Status ===
$(docker exec astor-postgres pg_isready)

=== Environment Variables (sanitized) ===
$(docker exec astor-backend env | grep -v PASSWORD | grep -v SECRET | grep -v KEY)

=== System Info ===
$(docker version)
$(docker-compose version)
EOF

cat diagnostics.txt
```

### Support Channels

- **GitHub Issues**: https://github.com/Raghavendra198902/astro/issues
- **Documentation**: Check other wiki pages
- **Logs**: Always include logs when reporting issues

---

**Related**: [Installation Guide](Installation-Guide) | [Configuration](Configuration)
