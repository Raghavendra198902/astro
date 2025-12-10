# Changelog

All notable changes to Astor AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-10

### 🎉 Major Release - Enterprise Features Complete

#### Added
- **Life Events Prediction Engine**: Past retrodiction and future forecasting (1-10 years)
- **Advanced Vedic Features**: 3-level Vimshottari Dasha, Panchang, Divisional charts, Shadbala
- **Yoga Detection System**: 8 major yogas with extensible YAML rules
- **AI Interpretation Engine**: Multi-provider LLM (OpenAI/Anthropic/Ollama) with RAG
- **Compatibility Analysis**: Kundali Milan (36 Guna) + Western Synastry
- **Numerology Engine**: Pythagorean & Chaldean systems with master numbers
- **Vision AI**: Face reading (468 landmarks) + Palm reading (21 landmarks)
- **Report Generation**: PDF reports with multiple themes (classic/minimal/festival)
- **Transit Alerts**: Celery-based hourly detection with email notifications
- **Payment Integration**: Stripe + Razorpay with subscription management
- **Consultation System**: Video calls (WebRTC), booking, scheduling
- **Enterprise Frontend**: 28 dashboard pages with glass morphism design
- **Premium Forms**: 6 enterprise-level forms (Chart, Compatibility, Numerology, etc.)

#### Backend Services (34 files, 5,800+ LOC)
- Chart calculation engine with Swiss Ephemeris
- AI services (LLM client, RAG engine, interpretation engine)
- Compatibility services (Vedic + Western)
- Numerology calculation engine
- Vision AI services (face + palm reading)
- Report generator (WeasyPrint + Jinja2)
- Payment services (Stripe + Razorpay)
- Consultation services (scheduling + video)
- Prediction services with caching
- Task scheduler (Celery + RabbitMQ)

#### API Endpoints (40+)
- Authentication & user management (6 endpoints)
- Chart generation & management (5 endpoints)
- Life events predictions (3 endpoints)
- AI interpretations (4 endpoints)
- Compatibility analysis (3 endpoints)
- Numerology calculations (2 endpoints)
- Vision AI (face/palm reading) (4 endpoints)
- Reports generation (3 endpoints)
- Transit alerts (3 endpoints)
- Payments & subscriptions (4 endpoints)
- Consultations & video (10 endpoints)

#### Database
- 13 tables with complete migrations
- pgvector extension for RAG semantic search
- Audit logging for compliance
- GDPR-compliant biometric storage (24hr expiry)

#### Infrastructure
- Docker Compose with 8 services
- Nginx reverse proxy with rate limiting
- Redis caching layer
- RabbitMQ message queue
- PostgreSQL 15 with pgvector
- Health checks for all services
- OpenTelemetry observability

#### Frontend (28 components)
- Premium landing page with glass morphism
- Split-screen login with demo accounts
- Dashboard with quick actions
- Birth chart visualization
- Life events prediction interface
- Compatibility analysis forms
- Numerology calculator
- Consultation booking
- Face/palm reading upload
- Panchang (daily almanac)
- Settings & profile management

#### Security & Compliance
- JWT authentication with refresh tokens
- Argon2 password hashing
- Role-based access control (Seeker/Astrologer/Admin)
- Rate limiting (10 req/s API, 100 req/s general)
- CORS configuration
- GDPR compliance with data retention policies
- Audit logging

#### Developer Experience
- Comprehensive documentation (22 MD files)
- Type safety (Pydantic + TypeScript)
- Code quality tools (Black, isort, ESLint, Prettier)
- Testing framework setup (pytest + Jest)
- Environment templates
- Setup automation scripts

### Fixed
- Health check endpoint with actual dependency verification
- Startup initialization (Redis, cache, ephemeris)
- Frontend accessibility (WCAG 2.1 compliance)
- TypeScript configuration for cross-OS compatibility
- Python command alias for CI/CD
- Error handling enhancements
- Logging improvements

### Changed
- Updated FastAPI to 0.109.0
- Upgraded Next.js to 14.0.4
- Enhanced security middleware
- Improved error responses
- Optimized database queries
- Better caching strategies

### Performance
- Redis caching for charts and predictions
- Connection pooling (20 base + 10 overflow)
- Async database operations
- Gzip compression
- Image optimization
- Code splitting in frontend

---

## [1.0.0] - 2025-11-01

### Initial Release
- Basic FastAPI backend structure
- Next.js frontend scaffold
- PostgreSQL database setup
- Docker containerization
- Swiss Ephemeris integration
- Simple chart calculation
- User authentication
- Basic API endpoints

---

## Version Format

**MAJOR.MINOR.PATCH**

- **MAJOR**: Incompatible API changes
- **MINOR**: New features (backwards-compatible)
- **PATCH**: Bug fixes (backwards-compatible)

## Release Schedule

- **Major releases**: Quarterly (Q1, Q2, Q3, Q4)
- **Minor releases**: Monthly
- **Patch releases**: As needed for critical fixes

## Upcoming Releases

### [2.1.0] - Planned for 2025-12-31
- Real-time notifications (WebSocket)
- Mobile app (React Native)
- Advanced chart customization
- Multi-language support (i18n)
- Enhanced AI models
- Performance optimization phase 2

### [2.2.0] - Planned for 2026-01-31
- Social features (sharing, community)
- Astrologer marketplace
- Advanced reporting templates
- API versioning (v2)
- GraphQL endpoint
- Enhanced analytics dashboard

### [3.0.0] - Planned for 2026-03-31
- Complete UI redesign
- Microservices architecture
- Kubernetes deployment
- Advanced ML models
- Blockchain integration (optional)
- Enterprise SSO/SAML
