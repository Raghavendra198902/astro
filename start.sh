#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Astor AI - Startup Script         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Get network IP
NETWORK_IP=$(hostname -I | awk '{print $1}')
echo -e "${GREEN}✓${NC} Detected Network IP: ${YELLOW}$NETWORK_IP${NC}"
echo ""

# Start Frontend
echo -e "${BLUE}Starting Frontend...${NC}"
cd /home/rrd/Documents/Project/frontend
HOST=0.0.0.0 npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

echo ""
echo -e "${GREEN}✓ Services Started Successfully!${NC}"
echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Access URLs                    ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║${NC} Frontend (Local):                     ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   ${YELLOW}http://localhost:3002${NC}                ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}                                        ${BLUE}║${NC}"
echo -e "${BLUE}║${NC} Frontend (Network):                   ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   ${YELLOW}http://$NETWORK_IP:3002${NC}       ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}                                        ${BLUE}║${NC}"
echo -e "${BLUE}║${NC} Backend API (when running):           ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   ${YELLOW}http://$NETWORK_IP:8000${NC}       ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   ${YELLOW}http://$NETWORK_IP:8000/docs${NC}  ${BLUE}║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Demo Accounts:${NC}"
echo -e "  Seeker:     ${GREEN}seeker@demo.com${NC} / ${GREEN}demo1234${NC}"
echo -e "  Astrologer: ${GREEN}astrologer@demo.com${NC} / ${GREEN}demo1234${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for processes
wait $FRONTEND_PID
