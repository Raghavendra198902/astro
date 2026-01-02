#!/bin/bash

# ASTOR AI - PostgreSQL Restore Script
# Restore database from backup file
# Date: January 2, 2026

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-astor_ai}"
DB_USER="${DB_USER:-astor_user}"
DB_PASSWORD="${DB_PASSWORD:-astor_pass}"

# Check if backup file is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: No backup file specified${NC}"
    echo -e "Usage: $0 <backup_file.sql.gz>"
    echo -e "Example: $0 /var/backups/astor-ai/postgresql/daily/daily_20260102_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    ASTOR AI - Database Restore Utility        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}⚠ WARNING: This will REPLACE the current database!${NC}"
echo -e "${YELLOW}   All existing data will be LOST!${NC}"
echo ""
echo -e "Database: ${GREEN}$DB_NAME${NC}"
echo -e "Host: ${GREEN}$DB_HOST:$DB_PORT${NC}"
echo -e "Backup File: ${GREEN}$BACKUP_FILE${NC}"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}Restore cancelled${NC}"
    exit 0
fi

# Export password
export PGPASSWORD="$DB_PASSWORD"

# Check database connection
echo -e "${BLUE}Checking database connection...${NC}"
if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Database is accessible${NC}"
else
    echo -e "${RED}✗ Cannot connect to database${NC}"
    exit 1
fi

# Drop existing database (with safety check)
echo -e "${BLUE}Dropping existing database...${NC}"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "DROP DATABASE IF EXISTS ${DB_NAME};"
echo -e "${GREEN}✓ Database dropped${NC}"

# Create fresh database
echo -e "${BLUE}Creating fresh database...${NC}"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE ${DB_NAME};"
echo -e "${GREEN}✓ Database created${NC}"

# Restore from backup
echo -e "${BLUE}Restoring from backup...${NC}"
pg_restore \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --verbose \
    --no-owner \
    --no-acl \
    "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database restored successfully${NC}"
else
    echo -e "${RED}✗ Database restore failed${NC}"
    exit 1
fi

# Verify restoration
echo -e "${BLUE}Verifying restoration...${NC}"
TABLE_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo -e "${GREEN}✓ Restored $TABLE_COUNT tables${NC}"

# Cleanup
unset PGPASSWORD

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Restore Completed Successfully!        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Restart application services"
echo -e "  2. Verify data integrity"
echo -e "  3. Test critical functionalities"
echo ""

exit 0
