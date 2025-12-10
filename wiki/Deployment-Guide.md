# Deployment Guide

Step-by-step guide to deploying Astor AI to production environments.

## 🎯 Deployment Overview

Astor AI can be deployed to:
- **Docker-based servers** (Recommended)
- **Kubernetes clusters**
- **Cloud platforms** (AWS, GCP, Azure)
- **PaaS providers** (Heroku, DigitalOcean App Platform)

## 🐳 Docker Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 4GB+ RAM
- 20GB+ disk space
- Domain name with DNS configured

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin

# Create deployment user
sudo useradd -m -s /bin/bash astro
sudo usermod -aG docker astro
```

### Step 2: Clone Repository

```bash
# Switch to deployment user
sudo su - astro

# Clone repository
git clone https://github.com/Raghavendra198902/astro.git
cd astro

# Checkout specific version
git checkout tags/v2.0.0  # Or latest stable branch
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with production values
nano .env
```

**Production .env**:
```bash
# Environment
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=WARNING

# Database (use strong passwords!)
POSTGRES_USER=astro_prod
POSTGRES_PASSWORD=$(openssl rand -base64 32)
POSTGRES_DB=astro_production
DATABASE_URL=postgresql://astro_prod:${POSTGRES_PASSWORD}@postgres:5432/astro_production

# Redis
REDIS_PASSWORD=$(openssl rand -base64 32)
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379/0

# JWT
SECRET_KEY=$(openssl rand -base64 48)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# API Keys (production)
OPENAI_API_KEY=sk-prod-your-key
STRIPE_API_KEY=sk_live_your-key
```

### Step 4: Build and Deploy

```bash
# Build images
docker-compose build --no-cache

# Start services
docker-compose up -d

# Run migrations
docker exec astor-backend alembic upgrade head

# Verify deployment
docker ps
curl http://localhost:8000/health
```

### Step 5: Configure Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx

# Create site configuration
sudo nano /etc/nginx/sites-available/astro
```

**Nginx configuration**:
```nginx
# API Backend
upstream backend {
    server localhost:8000;
}

# Frontend
upstream frontend {
    server localhost:3000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API Routes
    location /api {
        proxy_pass http://backend;
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

    # Frontend Routes
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Client max body size
    client_max_body_size 10M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/astro /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 6: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

### Step 7: Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## ☸️ Kubernetes Deployment

### Kubernetes Manifests

Create `k8s/` directory with manifests:

**1. Namespace** (`namespace.yaml`):
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: astro-production
```

**2. ConfigMap** (`configmap.yaml`):
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: astro-config
  namespace: astro-production
data:
  ENVIRONMENT: "production"
  LOG_LEVEL: "WARNING"
  API_V1_PREFIX: "/api/v1"
```

**3. Secrets** (`secrets.yaml`):
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: astro-secrets
  namespace: astro-production
type: Opaque
stringData:
  POSTGRES_PASSWORD: "your-secure-password"
  SECRET_KEY: "your-secret-key"
  OPENAI_API_KEY: "your-openai-key"
```

**4. PostgreSQL StatefulSet** (`postgres.yaml`):
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: astro-production
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: astro-secrets
              key: POSTGRES_PASSWORD
        - name: POSTGRES_DB
          value: astro_production
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 20Gi
```

**5. Backend Deployment** (`backend.yaml`):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: astro-production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/astro-backend:2.0.0
        ports:
        - containerPort: 8000
        envFrom:
        - configMapRef:
            name: astro-config
        - secretRef:
            name: astro-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: astro-production
spec:
  selector:
    app: backend
  ports:
  - port: 8000
    targetPort: 8000
```

**6. Ingress** (`ingress.yaml`):
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: astro-ingress
  namespace: astro-production
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - yourdomain.com
    secretName: astro-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 8000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 3000
```

### Deploy to Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml

# Check deployments
kubectl get pods -n astro-production
kubectl get services -n astro-production
kubectl get ingress -n astro-production

# View logs
kubectl logs -f deployment/backend -n astro-production
```

## ☁️ Cloud Platform Deployment

### AWS Deployment

**Using ECS Fargate**:
1. Push images to ECR
2. Create ECS cluster
3. Define task definitions
4. Create services
5. Configure ALB

**Using EKS**:
1. Create EKS cluster
2. Configure kubectl
3. Apply Kubernetes manifests
4. Set up ALB ingress controller

### Google Cloud Platform

**Using Cloud Run**:
```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/astro-backend

# Deploy
gcloud run deploy astro-backend \
  --image gcr.io/PROJECT_ID/astro-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### DigitalOcean App Platform

```yaml
# app.yaml
name: astro-ai
services:
- name: backend
  dockerfile_path: backend/Dockerfile
  github:
    repo: Raghavendra198902/astro
    branch: main
  envs:
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
  http_port: 8000
  
- name: frontend
  dockerfile_path: frontend/Dockerfile
  github:
    repo: Raghavendra198902/astro
    branch: main
  http_port: 3000

databases:
- name: db
  engine: PG
  version: "15"
```

## 🔄 CI/CD Pipeline

### GitHub Actions

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build images
      run: |
        docker-compose build
    
    - name: Run tests
      run: |
        docker-compose run backend pytest
    
    - name: Push to registry
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker-compose push
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /home/astro/astro
          git pull
          docker-compose pull
          docker-compose up -d
          docker exec astor-backend alembic upgrade head
```

## 📊 Post-Deployment

### Health Checks

```bash
# Backend health
curl https://yourdomain.com/api/v1/health

# Frontend health
curl -I https://yourdomain.com

# Database connection
docker exec astor-postgres pg_isready
```

### Monitoring Setup

```bash
# View logs
docker-compose logs -f --tail=100

# Monitor resources
docker stats

# Check disk space
df -h
```

### Backup Strategy

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec astor-postgres pg_dump -U astro_prod astro_production | gzip > backup_${DATE}.sql.gz
```

## 🔧 Maintenance

### Update Deployment

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose build
docker-compose up -d

# Run migrations
docker exec astor-backend alembic upgrade head
```

### Rollback

```bash
# Rollback to previous version
git checkout tags/v1.9.0
docker-compose up -d
docker exec astor-backend alembic downgrade -1
```

---

**Next**: [Monitoring](Monitoring) | [Troubleshooting](Troubleshooting)
