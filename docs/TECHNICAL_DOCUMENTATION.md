# Astor AI Platform - Technical Documentation

## Architecture Overview

### Backend (FastAPI)

```
backend/
├── app/
│   ├── api/              # API routes
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py
│   │       │   ├── profiles.py
│   │       │   ├── charts.py
│   │       │   ├── interpretations.py
│   │       │   ├── compatibility.py
│   │       │   ├── numerology.py
│   │       │   ├── vision.py
│   │       │   ├── reports.py
│   │       │   └── alerts.py
│   │       └── api.py
│   ├── core/             # Core configuration
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── security.py
│   │   ├── redis_client.py
│   │   └── logging_config.py
│   ├── models/           # SQLAlchemy models
│   │   └── models.py
│   ├── schemas/          # Pydantic schemas
│   │   └── schemas.py
│   ├── services/         # Business logic
│   │   ├── auth/
│   │   ├── chart/
│   │   │   └── engine.py      # Swiss Ephemeris integration
│   │   ├── ai/
│   │   │   ├── llm_client.py
│   │   │   ├── prompt_templates.py
│   │   │   └── rag_engine.py
│   │   ├── compat/
│   │   │   ├── vedic_guna.py
│   │   │   └── western_synastry.py
│   │   ├── numerology/
│   │   │   ├── pythagorean.py
│   │   │   └── chaldean.py
│   │   ├── vision/
│   │   │   ├── face_reading.py
│   │   │   └── palm_reading.py
│   │   └── reports/
│   │       └── pdf_generator.py
│   ├── workers/          # Celery tasks
│   │   └── celery_app.py
│   └── main.py           # Application entry point
├── alembic/              # Database migrations
├── tests/
└── requirements.txt
```

### Frontend (Next.js)

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── profiles/
│   │   ├── charts/
│   │   ├── interpretations/
│   │   └── compatibility/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── charts/
│   │   ├── ChartViewer.tsx
│   │   ├── VedicChart.tsx
│   │   └── WesternChart.tsx
│   ├── profile/
│   └── interpretation/
├── lib/
│   ├── api.ts
│   ├── hooks/
│   └── utils/
└── public/
```

## Core Modules

### 1. Chart Engine (Swiss Ephemeris)

**File:** `backend/app/services/chart/engine.py`

Responsibilities:
- Calculate planetary positions using Swiss Ephemeris
- Compute houses (Placidus, Whole Sign, Koch, Equal)
- Calculate aspects with configurable orbs
- Support multiple ayanamshas (Lahiri, Raman, Krishnamurti, Yukteshwar)
- Generate Vimshottari Dasha periods
- Calculate nakshatras and panchang

Key Functions:
```python
chart_engine.generate_chart(
    dt: datetime,
    lat: float,
    lon: float,
    system: str,  # "vedic" | "western"
    house_system: str,
    ayanamsha: str
) -> Dict[str, Any]
```

### 2. AI Interpretation Engine

**Directory:** `backend/app/services/ai/`

Components:
- **LLM Client**: Abstraction layer for OpenAI, Anthropic, local models
- **Prompt Templates**: Structured prompts for natal, transit, dasha interpretations
- **RAG Engine**: pgvector-based retrieval of canonical astrological texts

Workflow:
1. Chart data → Symbolization layer (extract features)
2. RAG retrieval → Find relevant canonical text snippets
3. LLM generation → Structured narrative with confidence scores
4. Safety filters → Check for medical/financial absolutes

### 3. Compatibility Engine

**Directory:** `backend/app/services/compat/`

**Vedic (36 Guna):**
- Varna (1 point)
- Vashya (2 points)
- Tara (3 points)
- Yoni (4 points)
- Graha Maitri (5 points)
- Gana (6 points)
- Bhakoot (7 points)
- Nadi (8 points)

**Western Synastry:**
- Aspect analysis between charts
- Composite chart generation

### 4. Numerology Module

**Directory:** `backend/app/services/numerology/`

Systems:
- **Pythagorean**: A=1, B=2, ..., Z=26
- **Chaldean**: A=1, B=2, ..., Z=8 (no 9)

Calculations:
- Life Path Number
- Expression/Destiny Number
- Soul Urge/Heart's Desire Number
- Personality Number
- Maturity Number
- Pinnacles & Challenges

### 5. Vision AI Module

**Directory:** `backend/app/services/vision/`

**Face Reading:**
- MediaPipe Face Mesh (468 landmarks)
- Extract geometric features
- Map to traditional interpretations
- On-device processing preferred

**Palm Reading:**
- MediaPipe Hands detection
- Line extraction (Heart, Head, Life, Fate)
- Mount prominence analysis

Privacy:
- Explicit consent required
- Store only feature vectors, not images
- Automatic purge after configured retention period

## Database Schema

### Core Tables

**users**
- id (UUID, PK)
- email (String, unique)
- hashed_password (String)
- role (Enum: seeker|astrologer|admin)
- is_active (Boolean)
- created_at (DateTime)

**profiles**
- id (UUID, PK)
- user_id (FK → users)
- name (String)
- dob_ts_utc (DateTime)
- tob_accuracy (Enum: exact|approximate|unknown)
- birthplace_text (String)
- latitude, longitude (Float)
- timezone (String)
- preferred_system (Enum: vedic|western)

**charts**
- id (UUID, PK)
- profile_id (FK → profiles)
- system (Enum)
- json_payload (JSONB)
- hash_key (String, unique)
- created_at (DateTime)

**kb_docs** (RAG Knowledge Base)
- id (UUID, PK)
- title (String)
- chunk_text (Text)
- embedding (Vector(1536))
- source_ref (String)
- category (String)

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login & get tokens
- `POST /api/v1/auth/refresh` - Refresh access token

### Profiles & Charts
- `POST /api/v1/profiles` - Create profile
- `GET /api/v1/profiles/{id}` - Get profile
- `POST /api/v1/charts` - Generate chart
- `GET /api/v1/charts/{id}` - Retrieve chart

### Interpretations
- `POST /api/v1/ai/interpretations/natal/{chart_id}` - Natal analysis
- `POST /api/v1/ai/interpretations/transit/{chart_id}` - Transit forecast
- `POST /api/v1/ai/interpretations/dasha/{chart_id}` - Dasha narrative

### Compatibility
- `POST /api/v1/compat/vedic` - Vedic 36 Guna
- `POST /api/v1/compat/western` - Western synastry

### Numerology
- `POST /api/v1/numerology/analyze` - Numerology analysis
- `POST /api/v1/numerology/compat` - Numerology compatibility

## Deployment

### Development
```bash
# Start infrastructure
docker-compose up -d postgres redis rabbitmq

# Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
```

### Production
```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec backend alembic upgrade head
```

## Testing

```bash
# Backend unit tests
cd backend
pytest -v --cov=app tests/

# Integration tests
pytest -v tests/integration/

# Load tests
locust -f tests/load/locustfile.py
```

## Monitoring

- **Metrics**: Prometheus + Grafana
- **Traces**: OpenTelemetry → Jaeger
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Errors**: Sentry

## Security

- JWT authentication with rotating refresh tokens
- Argon2 password hashing
- PII encryption at rest
- RBAC on all endpoints
- Rate limiting (60 req/min, 1000 req/hour)
- Audit logging for compliance

## Performance Optimization

- Redis caching for ephemeris results
- Idempotent chart generation (hash-based deduplication)
- Celery workers for async tasks (PDF generation, transits)
- CDN for static assets
- Database connection pooling
- pgvector indexes for RAG

## Compliance

- GDPR: Data export, right to deletion
- COPPA: Parental consent for minors
- Biometric data: Explicit consent, automatic purge
- Disclaimers: Not medical/financial/legal advice
