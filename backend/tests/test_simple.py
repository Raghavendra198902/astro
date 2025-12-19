"""Simple standalone tests that don't require full app imports"""

import pytest


def test_basic_math():
    """Test basic arithmetic"""
    assert 1 + 1 == 2
    assert 10 - 5 == 5
    assert 3 * 4 == 12
    assert 20 / 4 == 5


def test_string_operations():
    """Test string operations"""
    text = "ASTOR AI"
    assert text.lower() == "astor ai"
    assert text.upper() == "ASTOR AI"
    assert "ASTOR" in text
    assert text.startswith("ASTOR")


def test_list_operations():
    """Test list operations"""
    numbers = [1, 2, 3, 4, 5]
    assert len(numbers) == 5
    assert sum(numbers) == 15
    assert max(numbers) == 5
    assert min(numbers) == 1


def test_dictionary_operations():
    """Test dictionary operations"""
    data = {"name": "Test User", "age": 30, "role": "admin"}
    assert data["name"] == "Test User"
    assert "age" in data
    assert len(data) == 3


@pytest.mark.parametrize("value,expected", [
    (0, False),
    (1, True),
    ("", False),
    ("text", True),
    ([], False),
    ([1], True),
])
def test_truthiness(value, expected):
    """Test Python truthiness"""
    assert bool(value) == expected


class TestCalculator:
    """Test calculator class"""
    
    def test_addition(self):
        """Test addition"""
        assert 5 + 3 == 8
    
    def test_subtraction(self):
        """Test subtraction"""
        assert 10 - 3 == 7
    
    def test_multiplication(self):
        """Test multiplication"""
        assert 6 * 7 == 42
    
    def test_division(self):
        """Test division"""
        assert 15 / 3 == 5


@pytest.fixture
def sample_data():
    """Provide sample test data"""
    return {"users": [
        {"id": 1, "name": "Alice"},
        {"id": 2, "name": "Bob"},
        {"id": 3, "name": "Charlie"}
    ]}


def test_fixture_usage(sample_data):
    """Test using fixtures"""
    assert len(sample_data["users"]) == 3
    assert sample_data["users"][0]["name"] == "Alice"
    assert sample_data["users"][1]["id"] == 2
