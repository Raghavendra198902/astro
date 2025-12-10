#!/bin/bash
# Test all API endpoints

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

API_URL="${API_URL:-http://localhost:8000}"

echo -e "${YELLOW}Testing ASTOR AI API Endpoints${NC}"
echo -e "${YELLOW}================================${NC}\n"

# Test root endpoint
echo -e "${YELLOW}1. Testing Root Endpoint${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_URL/" 2>/dev/null)
status_code=$(echo "$response" | tail -1)
if [ "$status_code" = "200" ]; then
    echo -e "${GREEN}✓ Root endpoint working${NC}"
else
    echo -e "${RED}✗ Root endpoint failed (HTTP $status_code)${NC}"
fi

# Test version endpoint
echo -e "\n${YELLOW}2. Testing Version Endpoint${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/v1/version" 2>/dev/null)
status_code=$(echo "$response" | tail -1)
if [ "$status_code" = "200" ]; then
    echo -e "${GREEN}✓ Version endpoint working${NC}"
    echo "$response" | head -n -1 | jq '.' 2>/dev/null || echo "$response" | head -n -1
else
    echo -e "${RED}✗ Version endpoint failed (HTTP $status_code)${NC}"
fi

# Test health check
echo -e "\n${YELLOW}3. Testing Health Check${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_URL/healthz" 2>/dev/null)
status_code=$(echo "$response" | tail -1)
if [ "$status_code" = "200" ]; then
    echo -e "${GREEN}✓ Health check working${NC}"
else
    echo -e "${RED}✗ Health check failed (HTTP $status_code)${NC}"
fi

# Test auth endpoints (should fail without credentials)
echo -e "\n${YELLOW}4. Testing Auth Endpoints${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/v1/auth/login" -X POST 2>/dev/null)
status_code=$(echo "$response" | tail -1)
if [ "$status_code" = "422" ] || [ "$status_code" = "401" ]; then
    echo -e "${GREEN}✓ Auth endpoint exists${NC}"
else
    echo -e "${RED}✗ Auth endpoint issue (HTTP $status_code)${NC}"
fi

echo -e "\n${YELLOW}5. Testing API Docs${NC}"
response=$(curl -s -w "\n%{http_code}" "$API_URL/docs" 2>/dev/null)
status_code=$(echo "$response" | tail -1)
if [ "$status_code" = "200" ]; then
    echo -e "${GREEN}✓ API docs available at $API_URL/docs${NC}"
else
    echo -e "${YELLOW}⚠ API docs may be disabled in production mode${NC}"
fi

echo -e "\n${YELLOW}================================${NC}"
echo -e "${GREEN}Endpoint testing complete!${NC}\n"
