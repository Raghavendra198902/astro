# API Versioning Strategy

**Version:** 1.0  
**Last Updated:** November 14, 2025  
**Status:** Active

---

## Overview

This document defines the versioning strategy for the ASTOR AI API to ensure backward compatibility, smooth migrations, and clear communication of breaking changes.

---

## Versioning Scheme

### Current Version
- **Active Version:** v1
- **Base URL:** `/api/v1`
- **Status:** Stable, Production-ready

### Version Format
- **Pattern:** `/api/v{MAJOR}`
- **Example:** `/api/v1`, `/api/v2`
- **Increment:** Major version number increases with breaking changes

---

## Version Support Policy

### Support Lifecycle

| Stage | Duration | Description |
|-------|----------|-------------|
| **Active** | Indefinite | Full support, new features, bug fixes, security patches |
| **Maintenance** | 12 months | Bug fixes and security patches only, no new features |
| **Deprecated** | 6 months | Security patches only, migration strongly recommended |
| **End-of-Life** | - | No support, API removed |

### Current API Versions

| Version | Status | Released | Maintenance Start | Deprecation | EOL |
|---------|--------|----------|-------------------|-------------|-----|
| v1 | Active | Nov 2025 | - | - | - |

---

## Breaking Changes

### What Constitutes a Breaking Change

Breaking changes require a new major version:

1. **Removing endpoints** or fields
2. **Renaming endpoints** or parameters
3. **Changing response structure** (removing fields, changing data types)
4. **Changing HTTP methods** (GET → POST)
5. **Changing authentication** mechanisms
6. **Changing error codes** or formats
7. **Making optional parameters** required
8. **Changing default behavior** significantly

### Non-Breaking Changes

These can be made without version change:

1. **Adding new endpoints**
2. **Adding optional parameters**
3. **Adding new fields** to responses
4. **Deprecating fields** (with warning headers)
5. **Bug fixes** that don't change expected behavior
6. **Performance improvements**
7. **Documentation updates**

---

## Deprecation Process

### 1. Announcement Phase (3 months before)

```http
GET /api/v1/old-endpoint
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 14 Feb 2026 00:00:00 GMT
Link: </api/v2/new-endpoint>; rel="successor-version"
Warning: 299 - "This endpoint is deprecated and will be removed on Feb 14, 2026"

{
  "data": {...},
  "_meta": {
    "deprecated": true,
    "deprecation_date": "2025-11-14",
    "sunset_date": "2026-02-14",
    "migration_guide": "https://docs.astorai.com/migration/v1-to-v2",
    "alternative": "/api/v2/new-endpoint"
  }
}
```

### 2. Deprecation Notice

- **Email notification** to API users
- **Dashboard banner** warning
- **Changelog entry** with migration guide
- **API documentation** updated with deprecation notice

### 3. Migration Support

- **Migration guide** published
- **Code examples** for new endpoints
- **Parallel run** period (both versions active)
- **Support team** available for questions

### 4. Removal

- **Final warning** 30 days before removal
- **Endpoint returns** 410 Gone after sunset date
- **Documentation** archived, redirect to new version

---

## Migration Guide Template

When releasing a new version, provide:

### Example: v1 → v2 Migration

```markdown
# Migration Guide: v1 → v2

## Breaking Changes

### 1. Prediction Endpoint Structure Changed

**Old (v1):**
```http
POST /api/v1/predictions/events/combined
{
  "birth_date": "1990-05-15",
  "birth_time": "14:30",
  ...
}
```

**New (v2):**
```http
POST /api/v2/predictions/life-events
{
  "birthInfo": {
    "date": "1990-05-15T14:30:00Z",
    "location": {...}
  },
  "options": {
    "predictionYears": 10
  }
}
```

### Code Changes Required

**Python:**
```python
# Old
response = requests.post('/api/v1/predictions/events/combined', json={...})

# New
response = requests.post('/api/v2/predictions/life-events', json={...})
```

**JavaScript:**
```javascript
// Old
const data = await fetch('/api/v1/predictions/events/combined', {...});

// New
const data = await fetch('/api/v2/predictions/life-events', {...});
```

## Timeline

- **v2 Release:** March 1, 2026
- **v1 Maintenance:** March 1, 2026 - March 1, 2027
- **v1 Deprecated:** March 1, 2027 - September 1, 2027
- **v1 EOL:** September 1, 2027
```

---

## API Documentation Standards

### Version-Specific Documentation

Each version maintains separate documentation:

- `https://docs.astorai.com/api/v1`
- `https://docs.astorai.com/api/v2`

### Documentation Requirements

1. **OpenAPI/Swagger** specification for each version
2. **Changelog** with all breaking and non-breaking changes
3. **Migration guides** between versions
4. **Code examples** in multiple languages
5. **Deprecation warnings** clearly visible

---

## Client Communication

### Deprecation Announcement Template

**Email Subject:** ASTOR AI API: Deprecation Notice for v1 Endpoints

```
Dear ASTOR AI Developer,

We're reaching out to inform you about upcoming changes to the ASTOR AI API.

WHAT'S CHANGING:
- The following endpoints will be deprecated on [DATE]:
  - POST /api/v1/predictions/events/combined
  - GET /api/v1/predictions/history

WHY:
- Improved performance and structure
- Enhanced security and validation
- Consistent response format across all endpoints

WHAT YOU NEED TO DO:
1. Review the migration guide: [LINK]
2. Update your code to use v2 endpoints
3. Test your integration in our sandbox environment
4. Complete migration before [SUNSET_DATE]

TIMELINE:
- Today: Deprecation announced, v2 released
- [+3 months]: Maintenance mode begins
- [+6 months]: v1 endpoints removed

SUPPORT:
- Migration guide: [LINK]
- API documentation: [LINK]
- Support team: api-support@astorai.com

Thank you for using ASTOR AI!

The ASTOR AI Team
```

---

## Monitoring & Analytics

### Track API Version Usage

```python
# Log API version usage
@app.middleware("http")
async def track_api_version(request: Request, call_next):
    version = request.url.path.split('/')[2] if 'api' in request.url.path else 'unknown'
    
    # Track in analytics
    metrics.increment(f"api.version.{version}.requests")
    
    # Log deprecated endpoint usage
    if is_deprecated(request.url.path):
        logger.warning(f"Deprecated endpoint called: {request.url.path}")
        metrics.increment("api.deprecated.calls")
    
    response = await call_next(request)
    return response
```

### Deprecation Metrics Dashboard

Monitor:
- **Usage by version** (v1, v2 requests/day)
- **Deprecated endpoint calls** (count, users)
- **Migration progress** (% users on latest version)
- **Error rates** by version

---

## Exception Handling

### Allow Critical Fixes Without Version Bump

**Security patches** and **critical bug fixes** may be applied to all supported versions without creating a new major version.

**Example:** SQL injection fix, authentication bypass

---

## Questions & Support

- **API Documentation:** https://docs.astorai.com
- **Migration Guides:** https://docs.astorai.com/migration
- **Support Email:** api-support@astorai.com
- **GitHub Issues:** https://github.com/Raghavendra198902/astro/issues

---

## Changelog

### v1.0 - November 14, 2025
- Initial versioning strategy document
- Defined support lifecycle and deprecation process
- Established breaking change criteria
