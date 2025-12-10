# Installation Guide

Complete guide to installing and setting up Astor AI on your local machine or server.

## Prerequisites

### Required Software
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: Version 2.30 or higher
- **Node.js**: Version 18+ (for local frontend development)
- **Python**: Version 3.11+ (for local backend development)

### System Requirements
- **CPU**: 4+ cores recommended
- **RAM**: 8GB minimum, 16GB recommended
- **Disk Space**: 10GB minimum
- **OS**: Linux (Ubuntu 20.04+), macOS 11+, or Windows 10+ with WSL2

## Installation Steps

### 1. Install Docker

#### Ubuntu/Debian
```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### macOS
```bash
# Install Docker Desktop
brew install --cask docker

# Or download from https://www.docker.com/products/docker-desktop
```

#### Windows
Download Docker Desktop from https://www.docker.com/products/docker-desktop

### 2. Clone Repository

```bash
# Clone the repository
git clone https://github.com/Raghavendra198902/astro.git
cd astro

# Check repository structure
ls -la
```

### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

**Required Variables:**
```bash
# Database
POSTGRES_USER=astro_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=astro_db
DATABASE_URL=postgresql://astro_user:your_secure_password@postgres:5432/astro_db

# Redis
REDIS_URL=redis://redis:6379/0

# RabbitMQ
RABBITMQ_DEFAULT_USER=astro
RABBITMQ_DEFAULT_PASS=your_rabbitmq_password

# JWT Authentication
SECRET_KEY=your_secret_key_here_minimum_32_characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Keys (Optional)
OPENAI_API_KEY=your_openai_key  # For AI interpretations
LLM_API_KEY=your_llm_key        # Alternative LLM provider
```

### 4. Build Docker Images

```bash
# Build all services
docker-compose build

# This will take 5-10 minutes on first run
```

### 5. Start Services

```bash
# Start all containers in detached mode
docker-compose up -d

# Check container status
docker ps

# View logs
docker-compose logs -f
```

### 6. Initialize Database

```bash
# Run database migrations
docker exec -it astor-backend alembic upgrade head

# Verify database tables
docker exec -it astor-postgres psql -U astro_user -d astro_db -c "\dt"
```

### 7. Verify Installation

```bash
# Check backend health
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","database":"connected","redis":"connected"}

# Check frontend
curl http://localhost:3000

# Expected: HTTP 200 OK
```

### 8. Access Application

- **Frontend Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **API ReDoc**: http://localhost:8000/redoc
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **RabbitMQ Management**: http://localhost:15672

## Docker Services

The application uses 25 Docker services:

### Core Services (4)
1. **postgres** - PostgreSQL 15 with pgvector
2. **redis** - Redis 7 for caching
3. **rabbitmq** - RabbitMQ 3.12 for message queue
4. **backend** - FastAPI application (port 8000)

### Supporting Services (21)
- Frontend development server
- Worker processes
- Monitoring services
- Additional infrastructure

## Troubleshooting Installation

### Docker Permission Denied
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Port Already in Use
```bash
# Check what's using port 8000
sudo lsof -i :8000

# Kill the process
sudo kill -9 <PID>
```

### Database Connection Failed
```bash
# Restart PostgreSQL container
docker restart astor-postgres

# Check logs
docker logs astor-postgres
```

### Frontend Won't Start
```bash
# Rebuild frontend
cd frontend
npm install
npm run build

# Or rebuild container
docker-compose build frontend
docker-compose up -d frontend
```

### Memory Issues
```bash
# Increase Docker memory limit to 8GB
# Docker Desktop: Settings > Resources > Memory

# On Linux, edit /etc/docker/daemon.json
{
  "default-ulimits": {
    "memlock": {
      "Hard": -1,
      "Name": "memlock",
      "Soft": -1
    }
  }
}
```

## Local Development Setup

### Backend Development

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server with Turbopack
npm run dev

# Or production build
npm run build
npm start
```

## Uninstallation

```bash
# Stop all containers
docker-compose down

# Remove containers, networks, volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Remove project directory
cd ..
rm -rf astro
```

## Next Steps

- **[Quick Start Guide](Quick-Start)** - Get familiar with basic operations
- **[Configuration](Configuration)** - Customize your installation
- **[Development Setup](Development-Setup)** - Set up development environment

---

**Need Help?** Check the [Troubleshooting Guide](Troubleshooting) or open an issue on GitHub.
