#!/bin/bash

# Test Runner Script for ASTOR AI Backend
# Runs pytest with various configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Change to backend directory
cd "$(dirname "$0")/.."

print_header "ASTOR AI Test Suite"

# Check if pytest is installed
if ! command -v pytest &> /dev/null; then
    print_error "pytest is not installed!"
    echo "Install with: pip install -r requirements.txt"
    exit 1
fi

# Parse command line arguments
MODE="all"
COVERAGE=true
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --unit)
            MODE="unit"
            shift
            ;;
        --integration)
            MODE="integration"
            shift
            ;;
        --quick)
            MODE="quick"
            COVERAGE=false
            shift
            ;;
        --no-cov)
            COVERAGE=false
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            echo "Usage: ./run_tests.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --unit          Run only unit tests"
            echo "  --integration   Run only integration tests"
            echo "  --quick         Run quick tests without coverage"
            echo "  --no-cov        Skip coverage report"
            echo "  -v, --verbose   Verbose output"
            echo "  -h, --help      Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Build pytest command
PYTEST_CMD="pytest"

if [ "$VERBOSE" = true ]; then
    PYTEST_CMD="$PYTEST_CMD -vv"
else
    PYTEST_CMD="$PYTEST_CMD -v"
fi

if [ "$COVERAGE" = true ]; then
    PYTEST_CMD="$PYTEST_CMD --cov=app --cov-report=term-missing --cov-report=html"
fi

# Run tests based on mode
case $MODE in
    unit)
        print_header "Running Unit Tests"
        $PYTEST_CMD -m unit tests/
        ;;
    integration)
        print_header "Running Integration Tests"
        $PYTEST_CMD -m integration tests/
        ;;
    quick)
        print_header "Running Quick Tests"
        $PYTEST_CMD -x tests/
        ;;
    all)
        print_header "Running All Tests"
        $PYTEST_CMD tests/
        ;;
esac

# Check test result
if [ $? -eq 0 ]; then
    echo ""
    print_success "All tests passed!"
    
    if [ "$COVERAGE" = true ]; then
        echo ""
        print_success "Coverage report generated in htmlcov/index.html"
    fi
    
    exit 0
else
    echo ""
    print_error "Some tests failed!"
    exit 1
fi
