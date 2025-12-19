# Quick Test Reference Guide

## Run Tests

```bash
cd backend

# All tests
pytest

# With coverage
pytest --cov=app --cov-report=html

# Quick tests
./run_tests.sh --quick

# Specific file
pytest tests/test_auth.py

# Specific test
pytest tests/test_auth.py::TestPasswordHashing::test_hash_password

# By marker
pytest -m unit
pytest -m api
pytest -m db
```

## Test Structure

```
tests/
├── conftest.py              # Fixtures & config
├── fixtures.py              # Test data factories
├── test_auth.py            # Auth tests (300+ lines)
├── test_chart_engine.py    # Chart tests (350+ lines)
├── test_numerology.py      # Numerology tests (300+ lines)
├── test_api_endpoints.py   # API tests (400+ lines)
├── test_ai_interpretation.py # AI tests (350+ lines)
└── README.md               # Full documentation
```

## Common Fixtures

```python
# Database
db_session          # Test database session
test_user          # Pre-created user (Seeker)
test_astrologer    # Pre-created astrologer
test_admin         # Pre-created admin
test_profile       # Pre-created profile

# HTTP
client             # Async HTTP client
auth_headers       # Auth headers for user
astrologer_auth_headers  # Auth for astrologer
admin_auth_headers # Auth for admin

# Mocks
mock_llm_client    # Mocked LLM
mock_ephemeris     # Mocked ephemeris
redis_client       # Fake Redis

# Data
sample_birth_data  # Sample birth info
sample_chart_data  # Sample chart result
```

## Test Data Factory

```python
from tests.fixtures import TestDataFactory

# Create test data
user_data = TestDataFactory.create_user_data()
profile_data = TestDataFactory.create_profile_data()
chart_request = TestDataFactory.create_chart_request()
numerology_request = TestDataFactory.create_numerology_request()
compat_request = TestDataFactory.create_compatibility_request()
```

## Assertion Helpers

```python
from tests.fixtures import AssertionHelpers

# Validate structures
AssertionHelpers.assert_valid_chart_structure(chart)
AssertionHelpers.assert_valid_interpretation(interp)
AssertionHelpers.assert_valid_numerology(result)
```

## Write a Test

```python
import pytest
from tests.fixtures import TestDataFactory

class TestMyFeature:
    """Test my feature"""
    
    @pytest.mark.asyncio
    async def test_something(self, client, auth_headers):
        """Test something specific"""
        # Arrange
        data = TestDataFactory.create_chart_request()
        
        # Act
        response = await client.post(
            "/api/v1/charts/generate",
            json=data,
            headers=auth_headers
        )
        
        # Assert
        assert response.status_code == 200
        assert "planets" in response.json()
```

## Test Markers

```python
@pytest.mark.unit          # Fast unit test
@pytest.mark.integration   # Integration test
@pytest.mark.db           # Requires database
@pytest.mark.api          # API endpoint test
@pytest.mark.auth         # Auth test
@pytest.mark.slow         # Slow test
@pytest.mark.asyncio      # Async test (required)
```

## Coverage Commands

```bash
# Generate coverage
pytest --cov=app --cov-report=html

# View coverage
open htmlcov/index.html     # macOS
xdg-open htmlcov/index.html # Linux

# Coverage target: 70%+
```

## Test Runner Options

```bash
./run_tests.sh              # All tests + coverage
./run_tests.sh --unit       # Only unit tests
./run_tests.sh --integration # Only integration tests
./run_tests.sh --quick      # Quick (no coverage)
./run_tests.sh --no-cov     # Skip coverage
./run_tests.sh -v           # Verbose
./run_tests.sh --help       # Show help
```

## Mock External Services

```python
from unittest.mock import patch, AsyncMock

@pytest.mark.asyncio
async def test_with_mock(self):
    with patch("app.services.ai.LLMClient") as mock:
        mock_instance = AsyncMock()
        mock_instance.generate.return_value = {
            "interpretation": "Test",
            "confidence": 0.85
        }
        mock.return_value = mock_instance
        
        # Your test code
```

## Debug Tests

```bash
# Stop on first failure
pytest -x

# Show print statements
pytest -s

# Verbose
pytest -vv

# Show locals on failure
pytest -l

# Run specific test
pytest tests/test_auth.py::test_login_success -vv
```

## Common Issues

**Import errors:**
```bash
pip install -r requirements.txt
```

**Async errors:**
```bash
# Add @pytest.mark.asyncio decorator
pip install pytest-asyncio
```

**Database errors:**
```bash
# Tests use in-memory SQLite (no setup needed)
```

**Fixture not found:**
```bash
# Check conftest.py exists
# Verify fixture name spelling
```

## CI/CD

```bash
# Generate JUnit XML
pytest --junitxml=report.xml

# Generate HTML report
pytest --html=report.html --self-contained-html
```

## Performance

```bash
# Show slowest tests
pytest --durations=10

# Run in parallel (requires pytest-xdist)
pytest -n auto
```

## Test Statistics

- **Total Tests**: 150+
- **Coverage**: 70%+
- **Execution Time**: < 10s
- **Test Files**: 5
- **Fixtures**: 25+

## Key Test Areas

✅ Authentication (JWT, passwords, roles)
✅ Chart Engine (Vedic, Western, aspects)
✅ Numerology (Pythagorean, Chaldean)
✅ API Endpoints (CRUD, validation, errors)
✅ AI Interpretations (LLM, RAG, confidence)
✅ Payments & Subscriptions
✅ Consultations & Booking
✅ Reports & PDF Generation

## Resources

- Full docs: `tests/README.md`
- Completion report: `docs/completion-reports/UNIT_TESTING_COMPLETE.md`
- Pytest docs: https://docs.pytest.org/
- FastAPI testing: https://fastapi.tiangolo.com/tutorial/testing/
