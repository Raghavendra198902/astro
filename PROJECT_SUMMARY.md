# Astor AI - Project Summary & Quick Start Guide

## 🎯 Project Overview

**Astor AI** is a comprehensive, AI-driven astrology and numerology platform that delivers:

- ✨ **Vedic & Western Chart Generation** - Swiss Ephemeris-powered calculations
- 🤖 **AI-Powered Interpretations** - LLM-generated insights with RAG
- 💑 **Compatibility Analysis** - 36 Guna (Vedic) & Synastry (Western)
- 🔢 **Numerology** - Pythagorean & Chaldean systems
- 👤 **Vision AI** - Face & palm reading (privacy-first, opt-in)
- 📄 **Professional Reports** - PDF exports with custom themes
- 🔔 **Transit Alerts** - Real-time astrological event notifications
- 💳 **Payment Integration** - Stripe & Razorpay support
- 🎥 **Consultations** - Video/chat sessions with astrologers

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Python 3.11+ with FastAPI
- PostgreSQL 15+ with pgvector extension
- Redis for caching
- RabbitMQ + Celery for async tasks
- Swiss Ephemeris for astronomical calculations

**Frontend:**
- Next.js 14 with React 18
- Tailwind CSS for styling
- React Query for state management
- Recharts for chart visualizations

**AI & ML:**
- OpenAI / Anthropic / Local LLMs
- pgvector for RAG (Retrieval-Augmented Generation)
- MediaPipe for vision AI

**Infrastructure:**
- Docker & Docker Compose
- Nginx as reverse proxy
- OpenTelemetry + Grafana for observability

## 📁 Project Structure

```
astor-ai/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/             # REST API routes
│   │   ├── core/            # Config, security, database
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # Business logic
│   │   │   ├── chart/       # Chart Engine (Swiss Ephemeris)
│   │   │   ├── ai/          # AI Interpretation Engine
│   │   │   ├── compat/      # Compatibility Analysis
│   │   │   ├── numerology/  # Numerology Calculations
│   │   │   ├── vision/      # Face & Palm Reading
│   │   │   └── reports/     # PDF Report Generation
│   │   └── workers/         # Celery async tasks
│   ├── alembic/             # Database migrations
│   ├── tests/               # Unit & integration tests
│   └── requirements.txt     # Python dependencies
├── frontend/                # Next.js application
│   ├── app/                 # Next.js 14 app directory
│   ├── components/          # React components
│   └── lib/                 # Utilities & API client
├── infra/                   # Infrastructure configs
│   └── docker/              # Docker & Nginx configs
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
├── docker-compose.yml       # Development orchestration
├── .env.example             # Environment template
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- 4GB RAM minimum

### One-Command Setup

```bash
./scripts/setup.sh
```

This script will:
1. ✓ Check prerequisites
2. ✓ Create `.env` with generated secrets
3. ✓ Start PostgreSQL, Redis, RabbitMQ
4. ✓ Install Python dependencies
5. ✓ Run database migrations
6. ✓ Create initial admin user

### Manual Setup

#### 1. Clone & Configure

```bash
git clone <repository-url>
cd astor-ai
cp .env.example .env
# Edit .env with your configuration
```

#### 2. Start Infrastructure

```bash
docker-compose up -d postgres redis rabbitmq
```

#### 3. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Backend will be available at: http://localhost:8000

#### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:3000

## 📋 Default Credentials

**Admin Account:**
- Email: `admin@astorai.com`
- Password: `Admin@123`

⚠️ **IMPORTANT:** Change these credentials immediately in production!

## 📡 API Documentation

Once the backend is running, access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

**Authentication:**
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Get JWT tokens

**Charts:**
- `POST /api/v1/charts` - Generate birth chart
- `GET /api/v1/charts/{id}` - Retrieve chart

**Interpretations:**
- `POST /api/v1/ai/interpretations/natal/{chart_id}` - Get natal analysis
- `POST /api/v1/ai/interpretations/transit/{chart_id}` - Transit forecast

**Compatibility:**
- `POST /api/v1/compat/vedic` - 36 Guna matching
- `POST /api/v1/compat/western` - Synastry analysis

## 🔧 Configuration

### Essential Environment Variables

```env
# Database
DATABASE_URL=postgresql://astor_user:astor_pass@localhost:5432/astor_ai

# Security
SECRET_KEY=<generate-with-openssl-rand-hex-32>
JWT_ALGORITHM=HS256

# AI Provider
LLM_PROVIDER=openai  # openai|anthropic|ollama
LLM_API_KEY=sk-your-api-key
LLM_MODEL=gpt-4-turbo-preview

# Payments
STRIPE_SECRET_KEY=sk_test_xxx
RAZORPAY_KEY_ID=rzp_test_xxx
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest -v --cov=app tests/

# Frontend tests
cd frontend
npm test

# Load testing
cd backend
locust -f tests/load/locustfile.py
```

## 🐳 Docker Deployment

### Development

```bash
docker-compose up -d
```

Services:
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- RabbitMQ Management: http://localhost:15672

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring & Observability

**Metrics:**
- Prometheus: Collects metrics
- Grafana: Visualizations & dashboards

**Tracing:**
- OpenTelemetry: Distributed tracing
- Jaeger: Trace visualization

**Logs:**
- Structured JSON logging
- ELK Stack integration

**Errors:**
- Sentry for error tracking

## 🔐 Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Argon2 password hashing
- ✅ PII encryption at rest
- ✅ RBAC (Role-Based Access Control)
- ✅ Rate limiting (60/min, 1000/hour)
- ✅ Audit logging
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ XSS protection

## 📈 Performance Features

- ✅ Redis caching for ephemeris calculations
- ✅ Chart deduplication via hash keys
- ✅ Async task processing with Celery
- ✅ Database connection pooling
- ✅ CDN-ready static assets
- ✅ Gzip compression
- ✅ pgvector indexes for RAG

## 🌍 Compliance

- ✅ GDPR compliant (data export, right to deletion)
- ✅ COPPA compliant (parental consent for minors)
- ✅ Biometric data protection (explicit consent, auto-purge)
- ✅ Clear disclaimers (not medical/financial/legal advice)

## 📦 Core Features Status

### MVP (Week 1-8) ✅
- [x] Project scaffold & infrastructure
- [x] Database models & migrations
- [x] Authentication & authorization
- [x] Chart Engine (Swiss Ephemeris integration)
- [ ] Vedic calculations (Dashas, Yogas, Panchang)
- [ ] AI Interpretation Engine with RAG
- [ ] Compatibility Engine (36 Guna)
- [ ] Frontend Dashboard & UI

### Post-MVP
- [ ] Numerology Module
- [ ] Vision AI (Face & Palm reading)
- [ ] Report Generation (PDF)
- [ ] Transit Alerts & Notifications
- [ ] Payment Integration
- [ ] Consultation & Scheduling
- [ ] Mobile App (React Native)
- [ ] Multi-language support

## 🛠️ Development Workflow

### Adding a New Feature

1. **Create Database Model** (if needed)
   ```bash
   cd backend
   # Edit app/models/models.py
   alembic revision --autogenerate -m "Add feature table"
   alembic upgrade head
   ```

2. **Create Pydantic Schemas**
   ```bash
   # Edit app/schemas/schemas.py
   ```

3. **Implement Service Logic**
   ```bash
   # Create app/services/feature/service.py
   ```

4. **Add API Endpoint**
   ```bash
   # Create app/api/v1/endpoints/feature.py
   # Register in app/api/v1/api.py
   ```

5. **Write Tests**
   ```bash
   # Create tests/test_feature.py
   pytest tests/test_feature.py
   ```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

Proprietary - All rights reserved

## 📞 Support

- **Email:** support@astorai.com
- **Documentation:** https://docs.astorai.com
- **Issues:** GitHub Issues

## 🗺️ Roadmap

### Q1 2026
- [ ] Complete MVP with all core features
- [ ] Launch beta program
- [ ] Mobile app development

### Q2 2026
- [ ] Public launch
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Advanced rectification tools

### Q3 2026
- [ ] Marketplace for astrologers
- [ ] Muhurta (auspicious timing) finder
- [ ] Gemstone recommendation engine

### Q4 2026
- [ ] Voice-based consultations
- [ ] AR chart visualization
- [ ] Community features

---

## 🎉 You're All Set!

The Astor AI platform is now ready for development. Start by:

1. Exploring the API at http://localhost:8000/docs
2. Creating your first profile and chart
3. Testing AI interpretations
4. Building out remaining features

**Happy coding! 🚀✨**
