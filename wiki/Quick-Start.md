# Quick Start Guide

Get up and running with Astor AI in 5 minutes!

## 🚀 Starting Services

### Using Docker Compose (Recommended)

```bash
# Navigate to project directory
cd /home/rrd/astro

# Start all services
docker-compose up -d

# Verify all containers are running
docker ps | grep astor
```

### Using Start Script

```bash
# Use the provided startup script
./start.sh

# This automatically:
# - Checks prerequisites
# - Starts Docker containers
# - Runs database migrations
# - Verifies service health
```

## ✅ Verify Installation

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend
curl -I http://localhost:3000

# View container logs
docker-compose logs backend | tail -50
docker-compose logs frontend | tail -50
```

Expected output:
```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected",
  "version": "2.0.0"
}
```

## 🌐 Accessing the Application

### Frontend Dashboard
**URL**: http://localhost:3000

**Available Pages**:
- `/` - Landing page
- `/auth/login` - User login
- `/auth/register` - User registration
- `/dashboard` - Main dashboard
- `/dashboard/charts` - Birth chart generation
- `/dashboard/compatibility` - Relationship analysis
- `/dashboard/consultations` - Astrologer booking
- `/dashboard/predictions` - Future predictions
- `/dashboard/panchang` - Daily Hindu calendar
- `/dashboard/numerology` - Numerology calculations
- `/dashboard/face-reading` - Face analysis
- `/dashboard/palmistry` - Palm reading

### API Documentation
**Swagger UI**: http://localhost:8000/docs  
**ReDoc**: http://localhost:8000/redoc  
**OpenAPI JSON**: http://localhost:8000/openapi.json

## 👤 Create Your First User

### Via API

```bash
# Register a new user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@astroai.com",
    "password": "DemoPassword123!",
    "full_name": "Demo User"
  }'

# Login to get access token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=demo@astroai.com&password=DemoPassword123!"

# Save the access_token from response
```

### Via Frontend

1. Navigate to http://localhost:3000/auth/register
2. Fill in registration form
3. Click "Register"
4. Login at http://localhost:3000/auth/login

## 📊 Generate Your First Chart

### Via API

```bash
# Set your access token
TOKEN="your_access_token_here"

# Create a profile
PROFILE_RESPONSE=$(curl -X POST http://localhost:8000/api/v1/profiles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "date_of_birth": "1990-01-15",
    "time_of_birth": "14:30:00",
    "place_of_birth": "New York, NY, USA",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timezone": "America/New_York",
    "gender": "male"
  }')

# Extract profile_id from response
PROFILE_ID=$(echo $PROFILE_RESPONSE | jq -r '.id')

# Generate Vedic chart
curl -X POST http://localhost:8000/api/v1/charts/natal \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"profile_id\": \"$PROFILE_ID\",
    \"system\": \"vedic\",
    \"ayanamsa\": \"LAHIRI\"
  }" | jq .
```

### Via Frontend

1. Navigate to http://localhost:3000/dashboard/charts
2. Click "New Chart"
3. Fill in birth details:
   - Name
   - Date of birth
   - Time of birth
   - Place of birth
4. Select chart system (Vedic/Western)
5. Click "Generate Chart"

## 🔮 Check Daily Panchang

```bash
# Get today's panchang for a location
curl "http://localhost:8000/api/v1/panchang?date=2025-12-10&latitude=28.6139&longitude=77.2090&timezone=Asia/Kolkata" | jq .

# Response includes:
# - Tithi (lunar day)
# - Nakshatra (lunar mansion)
# - Yoga
# - Karana
# - Sunrise/Sunset times
# - Auspicious timings
```

## 💑 Compatibility Analysis

```bash
# Generate compatibility report between two charts
curl -X POST http://localhost:8000/api/v1/compatibility/kundali-milan \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chart_a_id": "uuid-of-first-chart",
    "chart_b_id": "uuid-of-second-chart"
  }' | jq .

# Get Guna Milan score (out of 36)
# Detailed analysis of 8 Kutas
```

## 📅 Book a Consultation

```bash
# List available astrologer slots
curl -X GET "http://localhost:8000/api/v1/consultations/slots?astrologer_id=astrologer-uuid&date=2025-12-15" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Book a consultation
curl -X POST http://localhost:8000/api/v1/consultations/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slot_id": "slot-uuid",
    "consultation_type": "birth_chart",
    "notes": "Need career guidance"
  }' | jq .
```

## 🔢 Numerology Calculation

```bash
# Calculate numerology for a profile
curl -X POST http://localhost:8000/api/v1/numerology/calculate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile_id": "your-profile-uuid"
  }' | jq .

# Returns:
# - Life Path Number
# - Destiny Number
# - Soul Urge Number
# - Personality Number
# - Detailed interpretations
```

## 📱 Common Operations

### Check System Status

```bash
# Backend health check
curl http://localhost:8000/health

# Database connection
docker exec astor-postgres pg_isready -U astro_user

# Redis connection
docker exec astor-redis redis-cli ping
```

### View Logs

```bash
# Backend logs
docker logs astor-backend -f

# Frontend logs
docker logs astor-frontend -f

# Database logs
docker logs astor-postgres -f

# All logs
docker-compose logs -f
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🎯 Next Steps

Now that you're up and running:

1. **[Configuration Guide](Configuration)** - Customize your setup
2. **[API Documentation](Authentication-API)** - Explore all endpoints
3. **[Chart Generation](Chart-Generation)** - Learn about chart systems
4. **[Development Setup](Development-Setup)** - Set up for development
5. **[Deployment Guide](Deployment-Guide)** - Deploy to production

## 🆘 Common Issues

### Backend Not Starting
```bash
# Check if port 8000 is available
sudo lsof -i :8000

# Restart backend
docker-compose restart backend
```

### Frontend Build Failed
```bash
cd frontend
rm -rf .next node_modules
npm install
docker-compose restart frontend
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check connection
docker exec astor-postgres psql -U astro_user -d astro_db -c "SELECT 1"
```

### Permission Denied
```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker
```

---

**Need More Help?** Check the [Troubleshooting Guide](Troubleshooting) or the [Installation Guide](Installation-Guide).
