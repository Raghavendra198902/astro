# Testing Documentation

## Overview

This document provides comprehensive information about the testing infrastructure for the ASTOR AI platform.

## Test Structure

```
backend/tests/
├── conftest.py              # Pytest configuration and fixtures
├── fixtures.py              # Test data factories and utilities
├── test_auth.py            # Authentication tests
├── test_chart_engine.py    # Chart calculation tests
├── test_numerology.py      # Numerology service tests
├── test_api_endpoints.py   # API endpoint tests
├── test_ai_interpretation.py # AI interpretation tests
└── services/
    └── predictions/
        └── test_cache.py   # Prediction cache tests
```

## Running Tests

### Quick Start

Run all tests:
```bash
cd backend
pytest
```

Run with coverage:
```bash
pytest --cov=app --cov-report=html
```

### Using Test Runner Script

The test runner script provides convenient options:

```bash
# Run all tests with coverage
./run_tests.sh

# Run only unit tests
./run_tests.sh --unit

# Run only integration tests
./run_tests.sh --integration

# Quick test run (no coverage)
./run_tests.sh --quick

# Verbose output
./run_tests.sh -v

# Skip coverage report
./run_tests.sh --no-cov
```

## Test Categories

### Unit Tests

Fast, isolated tests that don't require external dependencies:

```bash
pytest -m unit
```

**Examples:**
- Password hashing
- JWT token creation
- Numerology calculations
- Data validation

### Integration Tests

Tests that interact with databases, APIs, or external services:

```bash
pytest -m integration
```

**Examples:**
- API endpoint tests
- Database operations
- Redis caching
- Chart generation with ephemeris

### Database Tests

Tests requiring database connection:

```bash
pytest -m db
```

### API Tests

Tests for API endpoints:

```bash
pytest -m api
```

## Test Fixtures

### Database Fixtures

- `db_engine`: Test database engine (SQLite in-memory)
- `db_session`: Test database session
- `test_user`: Pre-created test user
- `test_astrologer`: Pre-created astrologer user
- `test_admin`: Pre-created admin user
- `test_profile`: Pre-created user profile

### HTTP Client Fixtures

- `client`: Async HTTP client with test database
- `auth_headers`: Authentication headers for test user
- `astrologer_auth_headers`: Authentication headers for astrologer
- `admin_auth_headers`: Authentication headers for admin

### Mock Fixtures

- `mock_llm_client`: Mocked LLM client
- `mock_ephemeris`: Mocked Swiss Ephemeris
- `redis_client`: Fake Redis client

### Data Fixtures

- `sample_birth_data`: Sample birth information
- `sample_chart_data`: Sample chart calculation result

## Writing Tests

### Test Structure

```python
import pytest
from tests.fixtures import TestDataFactory, AssertionHelpers

class TestFeature:
    """Test a specific feature"""
    
    @pytest.mark.asyncio
    async def test_something(self, client, auth_headers):
        """Test description"""
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
        AssertionHelpers.assert_valid_chart_structure(response.json())
```

### Using Test Data Factory

```python
from tests.fixtures import TestDataFactory

# Create user data
user_data = TestDataFactory.create_user_data(
    email="custom@example.com"
)

# Create chart request
chart_data = TestDataFactory.create_chart_request(
    latitude=40.7128,
    longitude=-74.0060
)

# Create numerology request
numerology_data = TestDataFactory.create_numerology_request(
    full_name="John Smith",
    system="pythagorean"
)
```

### Using Assertion Helpers

```python
from tests.fixtures import AssertionHelpers

# Validate chart structure
AssertionHelpers.assert_valid_chart_structure(chart_data)

# Validate interpretation
AssertionHelpers.assert_valid_interpretation(interpretation)

# Validate numerology result
AssertionHelpers.assert_valid_numerology(numerology_result)
```

### Mocking External Services

```python
from unittest.mock import patch, AsyncMock

@pytest.mark.asyncio
async def test_with_mock_llm(self, client, auth_headers):
    """Test with mocked LLM"""
    with patch("app.services.ai.interpretation_engine.LLMClient") as mock_llm:
        mock_instance = AsyncMock()
        mock_instance.generate.return_value = {
            "interpretation": "Test interpretation",
            "confidence": 0.85
        }
        mock_llm.return_value = mock_instance
        
        # Test code here
```

## Test Markers

Mark tests with categories:

```python
@pytest.mark.unit
def test_password_hashing():
    """Unit test for password hashing"""
    pass

@pytest.mark.integration
@pytest.mark.db
async def test_user_creation(db_session):
    """Integration test requiring database"""
    pass

@pytest.mark.slow
def test_heavy_calculation():
    """Test that takes significant time"""
    pass
```

## Coverage

### Viewing Coverage Report

After running tests with coverage:

```bash
# Open HTML report
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
start htmlcov/index.html  # Windows
```

### Coverage Goals

- **Overall Coverage**: > 70%
- **Critical Paths**: > 90%
  - Authentication
  - Payment processing
  - Data security

### Excluding Code from Coverage

```python
def debug_function():  # pragma: no cover
    """This function is excluded from coverage"""
    pass
```

## Best Practices

### 1. Test Naming

- Use descriptive names: `test_user_can_create_profile`
- Follow pattern: `test_<action>_<expected_result>`

### 2. Test Independence

- Each test should be independent
- Use fixtures for setup/teardown
- Don't rely on test execution order

### 3. Arrange-Act-Assert Pattern

```python
async def test_example(self):
    # Arrange: Set up test data
    data = {"key": "value"}
    
    # Act: Perform the action
    result = await function(data)
    
    # Assert: Verify the result
    assert result == expected
```

### 4. Test Data

- Use factories for consistent test data
- Avoid hardcoding test values
- Use meaningful test data

### 5. Async Tests

Always mark async tests:

```python
@pytest.mark.asyncio
async def test_async_function():
    result = await async_function()
    assert result is not None
```

## Continuous Integration

### GitHub Actions

Tests run automatically on:
- Push to main branch
- Pull requests
- Scheduled daily runs

### Local Pre-commit

Run tests before committing:

```bash
# Add to .git/hooks/pre-commit
#!/bin/bash
cd backend && pytest --quick
```

## Troubleshooting

### Common Issues

**Import Errors:**
```bash
# Ensure dependencies are installed
pip install -r requirements.txt
```

**Database Errors:**
```bash
# Clear test database
rm -f test.db
```

**Fixture Not Found:**
```bash
# Check conftest.py is present
# Ensure fixture is properly defined
```

**Async Errors:**
```bash
# Ensure pytest-asyncio is installed
pip install pytest-asyncio

# Mark test with @pytest.mark.asyncio
```

## Performance Testing

### Load Testing with Locust

```bash
# Install locust
pip install locust

# Run load tests
locust -f tests/load/locustfile.py
```

### Benchmarking

```python
import time

def test_chart_generation_performance():
    """Test chart generation speed"""
    start = time.time()
    
    # Generate chart
    result = generate_chart(data)
    
    elapsed = time.time() - start
    assert elapsed < 0.5  # Should complete in < 500ms
```

## Test Data Management

### Seeding Test Data

```python
@pytest.fixture(scope="session")
async def seed_test_data(db_session):
    """Seed database with test data"""
    # Create test records
    pass
```

### Cleaning Up

```python
@pytest.fixture
async def cleanup(db_session):
    """Clean up after tests"""
    yield
    # Cleanup code
    await db_session.rollback()
```

## Reporting

### Generate Test Report

```bash
# JUnit XML report
pytest --junitxml=report.xml

# HTML report
pytest --html=report.html --self-contained-html
```

### Test Metrics

Track:
- Test count
- Pass/fail rate
- Coverage percentage
- Execution time
- Flaky tests

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [pytest-asyncio](https://github.com/pytest-dev/pytest-asyncio)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [SQLAlchemy Testing](https://docs.sqlalchemy.org/en/14/orm/session_transaction.html#joining-a-session-into-an-external-transaction-such-as-for-test-suites)
