# Astor AI - Astrology & Numerology Platform Wiki

Welcome to the **Astor AI** documentation wiki! This comprehensive guide will help you understand, deploy, and extend our AI-driven astrology platform.

## 🌟 Overview

Astor AI is an enterprise-grade astrology and numerology platform that combines ancient wisdom with modern AI technology. Built with FastAPI (Python) and Next.js (TypeScript), it offers:

- **Vedic & Western Astrology**: Accurate birth chart generation
- **AI-Powered Interpretations**: GPT-4/Claude-based astrological insights
- **Compatibility Analysis**: Kundali Milan & Western Synastry
- **Biometric Analysis**: Face reading, palmistry (AI-driven)
- **Consultation System**: Real-time astrologer booking
- **Numerology**: Life path, destiny, soul urge calculations
- **Panchang**: Daily Hindu calendar with Tithi, Nakshatra, Yoga, Karana

## 📚 Documentation Structure

### Getting Started
- **[Installation Guide](Installation-Guide)** - Docker setup and local development
- **[Quick Start](Quick-Start)** - Get running in 5 minutes
- **[Configuration](Configuration)** - Environment variables and settings

### Architecture
- **[System Architecture](System-Architecture)** - High-level design overview
- **[Database Schema](Database-Schema)** - PostgreSQL tables and relationships
- **[API Design](API-Design)** - RESTful API structure and versioning
- **[AI/ML Infrastructure](AI-ML-Infrastructure)** - LLM, RAG, and vision AI

### Features
- **[Chart Generation](Chart-Generation)** - Vedic and Western birth charts
- **[Compatibility Analysis](Compatibility-Analysis)** - Relationship matching
- **[Consultation System](Consultation-System)** - Booking and scheduling
- **[Predictions](Predictions)** - Life events and transit predictions
- **[Panchang](Panchang)** - Daily Hindu calendar
- **[Numerology](Numerology)** - Numerological calculations
- **[Biometric Analysis](Biometric-Analysis)** - Face and palm reading

### API Reference
- **[Authentication API](Authentication-API)** - JWT-based auth
- **[Charts API](Charts-API)** - Birth chart endpoints
- **[Compatibility API](Compatibility-API)** - Relationship analysis
- **[Consultations API](Consultations-API)** - Booking management
- **[Reports API](Reports-API)** - PDF report generation
- **[Panchang API](Panchang-API)** - Daily calendar data

### Development
- **[Development Setup](Development-Setup)** - Local environment configuration
- **[Testing Guide](Testing-Guide)** - Unit and integration tests
- **[Deployment Guide](Deployment-Guide)** - Production deployment
- **[Contributing](Contributing)** - How to contribute to the project

### Operations
- **[Monitoring](Monitoring)** - Logging and metrics
- **[Performance Optimization](Performance-Optimization)** - Caching and indexing
- **[Security](Security)** - Authentication and data protection
- **[Troubleshooting](Troubleshooting)** - Common issues and solutions

## 🚀 Quick Links

- **Live API Documentation**: http://localhost:8000/docs
- **Frontend Dashboard**: http://localhost:3000
- **GitHub Repository**: https://github.com/Raghavendra198902/astro
- **API Version**: 2.0.0
- **Total Endpoints**: 69

## 🏗️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Python 3.11, FastAPI 0.109.0 |
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Database** | PostgreSQL 15 with pgvector |
| **Cache** | Redis 7 |
| **Queue** | RabbitMQ 3.12 |
| **AI/ML** | OpenAI, MediaPipe, OpenCV |
| **Astrology** | pyswisseph, Swiss Ephemeris |
| **Infrastructure** | Docker, Docker Compose |

## 📊 System Status

- **Database Tables**: 20
- **Database Indexes**: 65+
- **API Endpoints**: 69
- **Frontend Pages**: 8 dashboard pages
- **Docker Containers**: 25 services
- **Workspace Size**: 738M

## 🔑 Key Features

### 1. Multi-System Astrology Support
- Vedic (Sidereal)
- Western (Tropical)
- Ayanamsa configurations

### 2. AI-Powered Interpretations
- GPT-4 and Claude integration
- RAG-based knowledge retrieval
- Structured prompt templates
- Semantic search via pgvector

### 3. Enterprise-Grade Consultation System
- Real-time slot management
- Multi-timezone support
- Payment integration (Stripe/Razorpay)
- Booking confirmations

### 4. Biometric Analysis
- **Face Reading**: 468 facial landmarks (MediaPipe)
- **Palmistry**: 21 hand landmarks
- AI-driven trait analysis

### 5. Performance Optimized
- Redis caching (82-83% speed improvement)
- 65+ database indexes
- Async API operations
- Connection pooling

## 📖 Getting Started

1. **[Install Docker](Installation-Guide#docker-setup)**
2. **[Clone the repository](Installation-Guide#clone-repository)**
3. **[Configure environment](Configuration#environment-variables)**
4. **[Start services](Quick-Start#starting-services)**
5. **[Access dashboard](Quick-Start#accessing-dashboard)**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](Contributing) for:
- Code style guidelines
- Pull request process
- Testing requirements
- Documentation standards

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

- **Documentation Issues**: Open an issue on GitHub
- **Technical Questions**: Check [Troubleshooting](Troubleshooting)
- **Feature Requests**: Submit via GitHub Issues

---

**Last Updated**: December 10, 2025 | **Version**: 2.0.0
