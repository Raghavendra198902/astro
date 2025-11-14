# Getting Started with Astor AI Development

## 🎯 Welcome, Developer!

This guide will help you get the Astor AI platform up and running on your local machine for development.

## ⚡ Quick Start (5 Minutes)

### Option 1: Automated Setup (Recommended)

```bash
# 1. Clone the repository
git clone <repository-url>
cd astor-ai

# 2. Run the setup script
./scripts/setup.sh

# 3. Start the backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# 4. In a new terminal, start the frontend
cd frontend
npm install
npm run dev
```

### Option 2: Docker Compose (Easiest)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

## 📋 Prerequisites

Before you begin, ensure you have:

- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- **Python** (v3.11+)
- **Node.js** (v18+) and **npm** (v9+)
- **Git**
- **4GB RAM** minimum (8GB recommended)
- **10GB disk space**

### Verify Prerequisites

```bash
# Check versions
docker --version
docker-compose --version
python3 --version
node --version
npm --version
```

## 🔧 Detailed Setup

### Step 1: Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your preferred editor
nano .env  # or vim, code, etc.
```

**Key variables to configure:**

```env
# Database (default works for local development)
DATABASE_URL=postgresql://astor_user:astor_pass@localhost:5432/astor_ai

# Security (GENERATE A NEW SECRET KEY!)
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')

# AI Provider (get from OpenAI dashboard)
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-openai-api-key-here
LLM_MODEL=gpt-4-turbo-preview

# Leave other settings as default for development
```

### Step 2: Start Infrastructure Services

```bash
# Start PostgreSQL, Redis, RabbitMQ
docker-compose up -d postgres redis rabbitmq

# Wait for services to be ready (30 seconds)
sleep 30

# Verify services are running
docker-compose ps
```

You should see:
- `astor-postgres` - Up (healthy)
- `astor-redis` - Up (healthy)
- `astor-rabbitmq` - Up (healthy)

### Step 3: Backend Setup

```bash
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies (this takes 5-10 minutes)
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload
```

**Backend will be available at:** <http://localhost:8000>

**API Documentation:** <http://localhost:8000/docs>

### Step 4: Frontend Setup (Optional for now)

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be available at:** <http://localhost:3000>

## 🧪 Testing Your Setup

### 1. Check Backend Health

```bash
curl http://localhost:8000/healthz
```

**Expected response:**

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development"
}
```

### 2. Check API Documentation

Open your browser: <http://localhost:8000/docs>

You should see the interactive Swagger UI with all API endpoints.

### 3. Create a Test User

Using the Swagger UI or curl:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "role": "seeker"
  }'
```

### 4. Login and Get Token

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

**Save the access_token from the response!**

### 5. Generate Your First Chart

```bash
# First, create a profile
curl -X POST "http://localhost:8000/api/v1/profiles" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "date_of_birth": "1990-01-01",
    "time_of_birth": "12:00:00",
    "birthplace": "New York, USA",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timezone": "America/New_York",
    "preferred_system": "vedic"
  }'

# Then generate a chart
curl -X POST "http://localhost:8000/api/v1/charts" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile_id": "YOUR_PROFILE_ID",
    "system": "vedic"
  }'
```

## 🗂️ Project Structure Overview

```
astor-ai/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── api/         # REST API endpoints
│   │   ├── core/        # Configuration & utilities
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Request/response schemas
│   │   ├── services/    # Business logic
│   │   └── main.py      # Application entry
│   ├── tests/           # Backend tests
│   └── requirements.txt # Python dependencies
│
├── frontend/            # Next.js frontend
│   ├── app/            # Next.js pages
│   ├── components/     # React components
│   └── lib/            # Utilities
│
├── infra/              # Infrastructure configs
│   └── docker/         # Docker & Nginx
│
├── docs/               # Documentation
│   ├── TECHNICAL_DOCUMENTATION.md
│   └── MVP_CHECKLIST.md
│
├── scripts/            # Utility scripts
│   └── setup.sh        # Automated setup
│
└── docker-compose.yml  # Dev environment
```

## 🎯 Your First Development Task

Now that everything is set up, try adding a simple feature:

### Task: Add a "Get User Profile" Endpoint

1. **Add Pydantic Schema** (`backend/app/schemas/schemas.py`)
2. **Create Service Function** (`backend/app/services/user/service.py`)
3. **Add API Endpoint** (`backend/app/api/v1/endpoints/users.py`)
4. **Register Route** (`backend/app/api/v1/api.py`)
5. **Test** via Swagger UI

## 🐛 Troubleshooting

### Issue: Database Connection Fails

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Issue: Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use a different port
uvicorn app.main:app --port 8001 --reload
```

### Issue: Python Dependencies Installation Fails

```bash
# Update pip and setuptools
pip install --upgrade pip setuptools wheel

# Install dependencies one by one to identify problematic package
pip install fastapi
pip install uvicorn
# ... etc
```

### Issue: Ephemeris Data Not Found

```bash
# Download Swiss Ephemeris data manually
cd backend/ephemeris/data
wget https://www.astro.com/ftp/swisseph/ephe/seas_18.se1
wget https://www.astro.com/ftp/swisseph/ephe/semo_18.se1
wget https://www.astro.com/ftp/swisseph/ephe/sepl_18.se1
```

### Issue: Redis Connection Error

```bash
# Check Redis is running
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli ping
# Should return: PONG

# Restart Redis
docker-compose restart redis
```

## 📚 Next Steps

1. **Read the Documentation**
   - [Technical Documentation](../docs/TECHNICAL_DOCUMENTATION.md)
   - [MVP Checklist](../docs/MVP_CHECKLIST.md)

2. **Explore the Codebase**
   - Start with `backend/app/main.py`
   - Check out `backend/app/services/chart/engine.py`
   - Review `backend/app/models/models.py`

3. **Run Tests**
   ```bash
   cd backend
   pytest -v
   ```

4. **Make Your First Contribution**
   - Pick a task from the MVP checklist
   - Create a feature branch
   - Implement, test, and submit a PR

## 🤝 Getting Help

- **Documentation:** Check `docs/` directory
- **API Reference:** <http://localhost:8000/docs>
- **Issues:** GitHub Issues
- **Email:** support@astorai.com

## 🎉 You're Ready!

Your Astor AI development environment is now fully configured. Happy coding!

**Useful Commands:**

```bash
# Backend
cd backend && source venv/bin/activate
uvicorn app.main:app --reload
pytest -v

# Frontend
cd frontend
npm run dev
npm run build

# Docker
docker-compose up -d
docker-compose logs -f
docker-compose down

# Database
docker-compose exec postgres psql -U astor_user -d astor_ai
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

---

**Need help?** Don't hesitate to ask! This is a complex project, and we're here to support you. 🚀
