# System Architecture

Comprehensive overview of Astor AI's system architecture, design patterns, and infrastructure.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Web App    │  │  Mobile App  │  │  API Clients │         │
│  │  (Next.js)   │  │   (Future)   │  │    (REST)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Load Balancer   │
                    │      (Nginx)      │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                    Application Layer                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              FastAPI Backend (Python 3.11)               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │   API    │  │ Business │  │  Worker  │              │  │
│  │  │ Endpoints│  │  Logic   │  │  Queues  │              │  │
│  │  └──────────┘  └──────────┘  └──────────┘              │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼───────┐    ┌────────▼────────┐   ┌───────▼────────┐
│   PostgreSQL  │    │     Redis       │   │   RabbitMQ     │
│  (Primary DB) │    │   (Caching)     │   │  (Messaging)   │
│  + pgvector   │    │                 │   │                │
└───────────────┘    └─────────────────┘   └────────────────┘
        │
┌───────▼────────────────────────────────────────────────────┐
│              External Services Layer                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  OpenAI  │  │  Stripe  │  │ Razorpay │  │   AWS    │  │
│  │   API    │  │ Payment  │  │ Payment  │  │   S3     │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└────────────────────────────────────────────────────────────┘
```

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 16.0.8 (App Router)
- **UI Library**: React 19.2.1
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4
- **Build Tool**: Turbopack
- **State Management**: React Context API
- **HTTP Client**: Fetch API (native)

### Backend
- **Framework**: FastAPI 0.109.0
- **Language**: Python 3.11
- **Web Server**: Uvicorn (ASGI)
- **ORM**: SQLAlchemy 2.0.25
- **Migrations**: Alembic 1.13.1
- **Validation**: Pydantic v2
- **Authentication**: JWT (PyJWT)
- **Task Queue**: Celery (optional)

### Database & Storage
- **Primary Database**: PostgreSQL 15
- **Vector Database**: pgvector extension
- **Caching**: Redis 7 (alpine)
- **Message Queue**: RabbitMQ 3.12
- **File Storage**: Local (future: AWS S3)

### AI/ML Services
- **LLM Integration**: OpenAI API (GPT-4, GPT-3.5)
- **Alternative LLMs**: Anthropic Claude, Local LLMs
- **Computer Vision**: OpenCV 4.11.0
- **Face Detection**: MediaPipe 0.10.21
- **Embeddings**: Sentence Transformers
- **RAG Framework**: LangChain

### Astrology Libraries
- **Swiss Ephemeris**: pyswisseph 2.10.3.2
- **Timezone**: pytz, tzdata
- **Astronomy**: skyfield, astropy

### Infrastructure
- **Containerization**: Docker 20.10+
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx (planned)
- **Monitoring**: Prometheus + Grafana (planned)

## 📦 Service Architecture

### Core Services

#### 1. API Service (FastAPI)
**Port**: 8000  
**Purpose**: Main application server

**Responsibilities**:
- REST API endpoint handling
- Request validation (Pydantic)
- Authentication & authorization
- Business logic orchestration
- Response serialization

**Key Features**:
- Async/await for I/O operations
- Connection pooling
- Rate limiting
- CORS handling
- OpenAPI documentation

#### 2. Database Service (PostgreSQL)
**Port**: 5432  
**Purpose**: Primary data storage

**Features**:
- ACID compliance
- Foreign key constraints
- Triggers for audit logging
- pgvector for semantic search
- Full-text search capabilities

**Tables** (20):
- users, profiles, charts
- ai_runs, kb_docs
- consultation_bookings, consultation_slots
- biometric_readings
- payments, audit_logs
- numerology_readings
- And more...

#### 3. Cache Service (Redis)
**Port**: 6379  
**Purpose**: High-speed caching

**Use Cases**:
- API response caching
- Session storage
- Rate limiting counters
- Temporary data storage

**Performance**:
- 82-83% speed improvement on cached requests
- Sub-millisecond latency
- TTL-based expiration

#### 4. Message Queue (RabbitMQ)
**Port**: 5672 (AMQP), 15672 (Management UI)  
**Purpose**: Asynchronous task processing

**Queues**:
- Chart generation
- Report PDF generation
- AI interpretation tasks
- Email notifications
- Biometric processing

### Supporting Services

#### Frontend Service (Next.js)
**Port**: 3000  
**Purpose**: User interface

**Features**:
- Server-side rendering (SSR)
- Static site generation (SSG)
- Client-side routing
- API route handlers
- Image optimization

#### Worker Services
**Purpose**: Background job processing

**Tasks**:
- Long-running AI interpretations
- Batch chart generation
- Report compilation
- Data synchronization

## 🗄️ Database Schema

### Core Tables

**users** (Authentication)
```sql
- id (UUID, PK)
- email (VARCHAR, unique)
- hashed_password (VARCHAR)
- full_name (VARCHAR)
- is_active (BOOLEAN)
- is_verified (BOOLEAN)
- created_at (TIMESTAMP)
```

**profiles** (Personal Information)
```sql
- id (UUID, PK)
- user_id (UUID, FK -> users)
- name (VARCHAR)
- date_of_birth (DATE)
- time_of_birth (TIME)
- place_of_birth (VARCHAR)
- latitude (DECIMAL)
- longitude (DECIMAL)
- timezone (VARCHAR)
- gender (VARCHAR)
```

**charts** (Astrological Charts)
```sql
- id (UUID, PK)
- profile_id (UUID, FK -> profiles)
- system (VARCHAR) -- vedic/western
- ayanamsa (VARCHAR)
- hash_key (VARCHAR, unique) -- deduplication
- json_payload (JSONB)
- created_at (TIMESTAMP)
```

### Indexes (65+ total)

**Performance Indexes**:
- `idx_charts_hash_key` (UNIQUE) - Fast chart lookup
- `idx_charts_profile_id` - User's charts
- `idx_ai_runs_input_hash` - Deduplication
- `idx_consultation_slots_available` - Quick slot search
- `idx_audit_logs_timestamp` - Log queries

## 🔄 Data Flow

### Chart Generation Flow

```
1. Client Request
   └─> POST /api/v1/charts/natal
   
2. API Validation
   └─> Pydantic schema validation
   └─> JWT authentication
   
3. Hash Check (Deduplication)
   └─> Generate hash from birth details
   └─> Check if chart exists (idx_charts_hash_key)
   
4. Chart Calculation
   └─> Swiss Ephemeris calculation
   └─> Planetary positions
   └─> House cusps
   └─> Aspects
   
5. AI Interpretation (Optional)
   └─> Queue AI task (RabbitMQ)
   └─> RAG retrieval (pgvector)
   └─> LLM generation (OpenAI)
   
6. Database Storage
   └─> Insert chart record
   └─> Create audit log
   └─> Cache result (Redis)
   
7. Response
   └─> Return chart data + interpretations
```

### Consultation Booking Flow

```
1. Slot Search
   └─> Query available slots (indexed)
   └─> Filter by astrologer, date, timezone
   
2. Slot Reservation
   └─> Lock slot (database transaction)
   └─> Create booking record
   
3. Payment Processing
   └─> Initialize payment (Stripe/Razorpay)
   └─> Store payment intent
   
4. Payment Confirmation
   └─> Webhook from payment provider
   └─> Update booking status
   └─> Send confirmation email (queue)
   
5. Slot Activation
   └─> Mark slot as booked
   └─> Generate meeting link
   └─> Send notifications
```

## 🔐 Security Architecture

### Authentication
- **JWT-based** authentication
- **Access tokens**: 30-minute expiry
- **Refresh tokens**: 7-day expiry
- **Secure password hashing**: bcrypt

### Authorization
- **Role-based access control** (RBAC)
- **Resource ownership** validation
- **API key** authentication (future)

### Data Protection
- **Encryption at rest**: PostgreSQL encryption
- **Encryption in transit**: TLS/SSL
- **Environment secrets**: .env files (not in git)
- **Database credentials**: Secure storage

### API Security
- **Rate limiting**: Redis-based
- **CORS**: Configured origins only
- **Input validation**: Pydantic schemas
- **SQL injection prevention**: Parameterized queries
- **XSS protection**: Content security policy

## 📊 Performance Optimization

### Caching Strategy
1. **API Response Caching** (Redis)
   - Panchang data (1 hour TTL)
   - Chart calculations (24 hour TTL)
   - Profile data (15 minute TTL)

2. **Database Query Optimization**
   - 65+ indexes on frequent queries
   - Connection pooling (20 connections)
   - Query result caching

3. **Application-Level Caching**
   - In-memory caching for ephemeris data
   - Memoization of calculations

### Async Processing
- **FastAPI async endpoints**: Non-blocking I/O
- **Database async driver**: asyncpg
- **Concurrent requests**: 100+ simultaneous

### Load Balancing (Future)
- **Horizontal scaling**: Multiple backend instances
- **Nginx reverse proxy**: Load distribution
- **Session affinity**: Redis-based sessions

## 🔍 Monitoring & Observability

### Logging
- **Structured logging**: JSON format
- **Log levels**: DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Log rotation**: Daily rotation, 30-day retention

### Metrics (Planned)
- **Request rate**: Requests per second
- **Response time**: P50, P95, P99 latency
- **Error rate**: 4xx, 5xx responses
- **Database**: Query time, connection pool usage
- **Cache**: Hit rate, eviction rate

### Health Checks
- **Endpoint**: `/health`
- **Checks**: Database, Redis, RabbitMQ
- **Response**: JSON with service status

## 🚀 Scalability

### Vertical Scaling
- Increase container resources (CPU, RAM)
- Optimize database queries
- Tune connection pools

### Horizontal Scaling
- Deploy multiple backend instances
- Use load balancer (Nginx)
- Shared Redis for session state
- Centralized logging

### Database Scaling
- Read replicas for read-heavy operations
- Partitioning large tables
- Archive old data

---

**Next**: [Database Schema](Database-Schema) | [API Design](API-Design)
