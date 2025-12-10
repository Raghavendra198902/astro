# API Design

Complete reference for Astor AI's RESTful API design, endpoints, and integration patterns.

## 🎯 API Overview

- **Base URL**: `http://localhost:8000/api/v1`
- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Authentication**: JWT Bearer Token
- **Version**: 2.0.0
- **Total Endpoints**: 69

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Spec**: http://localhost:8000/openapi.json

### Documentation Features
- Interactive API explorer
- Request/response examples
- Schema definitions
- Authentication testing
- Try-it-out functionality

## 🔐 Authentication

### Registration
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "John Doe"
}
```

**Response**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_verified": false,
  "created_at": "2025-12-10T10:00:00Z"
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=SecurePassword123!
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer {access_token}
```

## 📊 Endpoint Categories

### 1. Authentication (`/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user
- `POST /refresh` - Refresh access token
- `POST /logout` - User logout

### 2. Profiles (`/profiles`)
- `POST /` - Create profile
- `GET /` - List user profiles
- `GET /{id}` - Get profile details
- `PUT /{id}` - Update profile
- `DELETE /{id}` - Delete profile

### 3. Charts (`/charts`)
- `POST /natal` - Generate birth chart
- `GET /natal/{id}` - Get chart details
- `GET /` - List user charts
- `POST /transit` - Calculate transits
- `POST /progression` - Calculate progressions

### 4. Compatibility (`/compatibility`)
- `POST /kundali-milan` - Vedic compatibility
- `POST /synastry` - Western compatibility
- `GET /{id}` - Get compatibility report

### 5. Consultations (`/consultations`)
- `GET /slots` - List available slots
- `POST /bookings` - Book consultation
- `GET /bookings` - List user bookings
- `GET /bookings/{id}` - Get booking details
- `PUT /bookings/{id}` - Update booking
- `DELETE /bookings/{id}` - Cancel booking

### 6. Predictions (`/predictions`)
- `POST /life-events` - Predict major life events
- `POST /career` - Career predictions
- `POST /relationship` - Relationship predictions
- `GET /history` - Prediction history

### 7. Reports (`/reports`)
- `GET /natal/{chart_id}` - Generate natal report
- `GET /compatibility/{analysis_id}` - Compatibility report
- `GET /transit/{chart_id}` - Transit report
- `GET /annual/{chart_id}` - Annual forecast

### 8. Panchang (`/panchang`)
- `GET /` - Daily panchang
- `GET /monthly` - Monthly panchang
- `GET /auspicious` - Auspicious timings

### 9. Numerology (`/numerology`)
- `POST /calculate` - Calculate numerology
- `GET /{id}` - Get numerology reading
- `GET /` - List readings

### 10. Biometric (`/biometric`)
- `POST /face` - Upload face reading
- `POST /palm` - Upload palm reading
- `GET /{id}` - Get reading results
- `GET /` - List readings

### 11. Payments (`/payments`)
- `POST /create-intent` - Initialize payment
- `POST /confirm` - Confirm payment
- `GET /{id}` - Payment status
- `GET /` - Payment history

## 📝 Request/Response Patterns

### Standard Request Headers
```http
Authorization: Bearer {access_token}
Content-Type: application/json
Accept: application/json
X-Request-ID: {unique-id} (optional)
```

### Standard Response Format
```json
{
  "data": {...},          // Response data
  "message": "Success",   // Human-readable message
  "timestamp": "2025-12-10T10:00:00Z"
}
```

### Error Response Format
```json
{
  "detail": "Error message",
  "error_code": "INVALID_INPUT",
  "status_code": 400,
  "timestamp": "2025-12-10T10:00:00Z"
}
```

## 🔢 HTTP Status Codes

### Success Codes
- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST (resource created)
- `202 Accepted` - Request accepted (async processing)
- `204 No Content` - Successful DELETE (no body)

### Client Error Codes
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource conflict
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded

### Server Error Codes
- `500 Internal Server Error` - Server error
- `502 Bad Gateway` - Upstream service error
- `503 Service Unavailable` - Service down
- `504 Gateway Timeout` - Request timeout

## 🎨 Example API Calls

### Generate Vedic Birth Chart

**Request**:
```bash
curl -X POST http://localhost:8000/api/v1/charts/natal \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "profile_id": "profile-uuid",
    "system": "vedic",
    "ayanamsa": "LAHIRI"
  }'
```

**Response**:
```json
{
  "id": "chart-uuid",
  "profile_id": "profile-uuid",
  "system": "vedic",
  "ayanamsa": "LAHIRI",
  "planets": {
    "sun": {"sign": "Sagittarius", "degree": 23.45},
    "moon": {"sign": "Capricorn", "degree": 12.30}
  },
  "houses": [...],
  "aspects": [...],
  "created_at": "2025-12-10T10:00:00Z"
}
```

### Check Daily Panchang

**Request**:
```bash
curl "http://localhost:8000/api/v1/panchang?\
date=2025-12-10&\
latitude=28.6139&\
longitude=77.2090&\
timezone=Asia/Kolkata"
```

**Response**:
```json
{
  "date": "2025-12-10",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "timezone": "Asia/Kolkata"
  },
  "tithi": {
    "name": "Pratipada",
    "paksha": "Shukla",
    "number": 1
  },
  "nakshatra": {
    "name": "Ashwini",
    "lord": "Ketu"
  },
  "yoga": "Vishkambha",
  "karana": "Bava",
  "sunrise": "07:05:32",
  "sunset": "17:28:45",
  "moonrise": "08:12:15",
  "moonset": "18:45:30"
}
```

### Book Consultation

**Request**:
```bash
curl -X POST http://localhost:8000/api/v1/consultations/bookings \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "slot_id": "slot-uuid",
    "consultation_type": "birth_chart",
    "notes": "Need career guidance"
  }'
```

**Response**:
```json
{
  "id": "booking-uuid",
  "slot_id": "slot-uuid",
  "astrologer": {
    "id": "astrologer-uuid",
    "name": "Dr. Sharma",
    "specialization": "Vedic Astrology"
  },
  "scheduled_start": "2025-12-15T14:00:00Z",
  "duration_minutes": 60,
  "status": "confirmed",
  "payment_status": "pending",
  "meeting_link": "https://meet.astroai.com/abc123"
}
```

## 🔄 Pagination

For list endpoints:

**Request**:
```http
GET /api/v1/charts?page=1&limit=20&sort_by=created_at&order=desc
```

**Response**:
```json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "pages": 8,
  "has_next": true,
  "has_prev": false
}
```

## 🔍 Filtering

Example filters:
```http
GET /api/v1/consultations/bookings?status=confirmed&from_date=2025-12-01
GET /api/v1/charts?system=vedic&created_after=2025-12-01
```

## ⚡ Rate Limiting

- **Rate Limit**: 100 requests per minute per IP
- **Burst Limit**: 20 requests per second
- **Headers**:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1702210800
  ```

## 🔒 API Security Best Practices

1. **Always use HTTPS in production**
2. **Store tokens securely** (not in localStorage)
3. **Validate input** on client side
4. **Handle errors gracefully**
5. **Implement token refresh** before expiry
6. **Use environment variables** for API keys
7. **Implement retry logic** with exponential backoff

## 📦 SDK Support (Future)

Planned SDKs:
- **JavaScript/TypeScript**: `@astroai/sdk-js`
- **Python**: `astroai-sdk`
- **React**: `@astroai/react`
- **Mobile**: React Native bindings

## 🔗 Webhooks (Future)

Webhook events:
- `consultation.booked`
- `consultation.completed`
- `payment.succeeded`
- `payment.failed`
- `chart.generated`

---

**Next**: [Authentication API](Authentication-API) | [Charts API](Charts-API)
