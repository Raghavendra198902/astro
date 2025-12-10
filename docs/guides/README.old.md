# Astor AI - Astrology & Numerology Platform

**Version:** 1.0  
**Owner:** Raghavendra  
**Date:** Oct 22, 2025

## Overview

Astor AI is an enterprise-grade, AI-driven astrology platform supporting Vedic & Western chart generation, automated interpretations, compatibility analysis, numerology, face/palm reading, and consultative workflows across web & mobile.

## Architecture

- **Frontend:** Next.js 14, React 18, Tailwind CSS, React Query
- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, Celery
- **Astro Engine:** Swiss Ephemeris (pyswisseph), Custom Vedic/Western modules
- **AI Layer:** LLM with RAG (pgvector), Prompt orchestration
- **Data:** PostgreSQL + pgvector, Redis, RabbitMQ
- **Infra:** Docker, Nginx, OpenTelemetry, Grafana

## Project Structure

```
astor-ai/
├── backend/               # FastAPI application
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Config, security, dependencies
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   │   ├── auth/
│   │   │   ├── chart/
│   │   │   ├── ai/
│   │   │   ├── compat/
│   │   │   ├── numerology/
│   │   │   ├── vision/
│   │   │   └── reports/
│   │   └── workers/      # Celery tasks
│   ├── alembic/          # Database migrations
│   ├── tests/
│   └── requirements.txt
├── frontend/             # Next.js application
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
├── infra/                # Infrastructure as code
│   ├── docker/
│   ├── k8s/
│   └── terraform/
├── docs/                 # Documentation
└── scripts/              # Utility scripts
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ with pgvector extension

### Development Setup

```bash
# Clone repository
git clone <repository-url>
cd astor-ai

# Start infrastructure services
docker-compose up -d postgres redis rabbitmq

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# Frontend setup
cd ../frontend
npm install
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/astor_ai
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=<generate-secure-key>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI
LLM_PROVIDER=openai  # openai|anthropic|local
LLM_API_KEY=<your-key>
LLM_MODEL=gpt-4-turbo

# Payments
STRIPE_SECRET_KEY=<stripe-key>
RAZORPAY_KEY_ID=<razorpay-key>
```

## Features

### Core Modules

- ✅ **Authentication & Authorization** - JWT, RBAC (seeker/astrologer/admin)
- ✅ **Birth Chart Engine** - Swiss Ephemeris, Vedic & Western systems
- ✅ **Dasha & Transits** - Vimshottari, transit detection, alerts
- ✅ **AI Interpretations** - LLM-powered insights with RAG
- ✅ **Compatibility Analysis** - 36 Guna, Synastry, AI summaries
- ✅ **Numerology** - Pythagorean & Chaldean systems
- ✅ **Vision AI** - Face & palm reading (opt-in, privacy-first)
- ✅ **Report Generation** - PDF exports with custom themes
- ✅ **Consultations** - Booking, chat, video sessions
- ✅ **Payments** - Stripe/Razorpay, subscription plans

### API Endpoints

**Auth**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login & get JWT tokens
- `POST /auth/refresh` - Refresh access token

**Profiles & Charts**
- `POST /profiles` - Create profile
- `GET /profiles/{id}` - Get profile details
- `POST /charts` - Generate birth chart
- `GET /charts/{id}` - Retrieve chart

**Interpretations**
- `POST /ai/interpretations/natal/{chart_id}` - Natal analysis
- `POST /ai/interpretations/transit/{chart_id}` - Transit forecast
- `POST /ai/interpretations/dasha/{chart_id}` - Dasha narrative

**Compatibility**
- `POST /compat/vedic` - Vedic compatibility (36 Guna)
- `POST /compat/western` - Western synastry

**Numerology**
- `POST /numerology/analyze` - Numerology analysis
- `POST /numerology/compat` - Numerology compatibility

**Vision AI**
- `POST /vision/face/analyze` - Face reading
- `POST /vision/palm/analyze` - Palm reading

**Reports**
- `POST /reports/{chart_id}` - Generate report
- `GET /reports/{id}` - Download report

## Testing

```bash
# Backend tests
cd backend
pytest -v --cov=app tests/

# Frontend tests
cd frontend
npm test
npm run test:e2e
```

## Deployment

```bash
# Production build
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Check health
curl http://localhost:8000/healthz
```

## Security

- JWT authentication with rotating refresh tokens
- Argon2 password hashing
- PII encryption at rest (KMS-managed)
- RBAC on all sensitive endpoints
- Rate limiting & audit logging
- Biometric data purge policies

## Monitoring

- **Metrics:** Prometheus + Grafana
- **Traces:** OpenTelemetry
- **Logs:** ELK Stack
- **Alerts:** Alertmanager

Access dashboards:
- Grafana: http://localhost:3001
- Kibana: http://localhost:5601

## MVP Timeline (8-10 Weeks)

- **Week 1-2:** Project scaffold, auth, profiles, ephemeris integration
- **Week 3:** Vedic calculations, transit basics, cache layer
- **Week 4:** AI interpretations v1, report generation
- **Week 5:** Compatibility engine (36 Guna + AI)
- **Week 6:** Dashboard UI, chart visualizations
- **Week 7:** Alerts, usage analytics
- **Week 8:** Testing, Docker, staging launch

## Contributing

1. Follow code style guidelines
2. Write tests for new features
3. Update documentation
4. Submit PR with clear description

## License

Proprietary - All rights reserved

## Support

For issues and questions:
- Email: support@astorai.com
- Docs: https://docs.astorai.com
