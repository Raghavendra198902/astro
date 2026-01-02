#!/bin/bash

# ASTOR AI - PostgreSQL Backup Script
# Automated database backup with compression and retention policy
# Date: January 2, 2026

set -e

# Configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-astor_ai}"
DB_USER="${DB_USER:-astor_user}"
DB_PASSWORD="${DB_PASSWORD:-astor_pass}"

# Backup settings
BACKUP_DIR="${BACKUP_DIR:-/var/backups/astor-ai/postgresql}"
RETENTION_DAYS=7      # Daily backups for 7 days
RETENTION_WEEKS=4     # Weekly backups for 4 weeks
RETENTION_MONTHS=12   # Monthly backups for 12 months

# S3 settings (optional - for cloud backup)
S3_ENABLED="${S3_ENABLED:-false}"
S3_BUCKET="${S3_BUCKET:-astor-ai-backups}"
S3_REGION="${S3_REGION:-us-east-1}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE=$(date +%Y-%m-%d)
DAY_OF_WEEK=$(date +%u)  # 1=Monday, 7=Sunday
DAY_OF_MONTH=$(date +%d)

# Backup file naming
DAILY_BACKUP="daily_${TIMESTAMP}.sql.gz"
WEEKLY_BACKUP="weekly_$(date +%Y_W%V).sql.gz"
MONTHLY_BACKUP="monthly_$(date +%Y_%m).sql.gz"

# Create backup directories
mkdir -p "$BACKUP_DIR/daily"
mkdir -p "$BACKUP_DIR/weekly"
mkdir -p "$BACKUP_DIR/monthly"
mkdir -p "$BACKUP_DIR/logs"

# Log file
LOG_FILE="$BACKUP_DIR/logs/backup_${DATE}.log"

# Function to log messages
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} ✓ $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} ✗ $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} ⚠ $1" | tee -a "$LOG_FILE"
}

# Start backup
log "╔════════════════════════════════════════════════╗"
log "║    ASTOR AI - PostgreSQL Backup Starting      ║"
log "╚════════════════════════════════════════════════╝"
log ""
log "Database: $DB_NAME"
log "Host: $DB_HOST:$DB_PORT"
log "Backup Directory: $BACKUP_DIR"
log ""

# Check if PostgreSQL is accessible
log "Checking database connection..."
export PGPASSWORD="$DB_PASSWORD"

if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; then
    log_success "Database is accessible"
else
    log_error "Cannot connect to database"
    exit 1
fi

# Create daily backup
log "Creating daily backup..."
DAILY_FILE="$BACKUP_DIR/daily/$DAILY_BACKUP"

pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --format=custom \
    --compress=9 \
    --verbose \
    --file="$DAILY_FILE" 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$DAILY_FILE" | cut -f1)
    log_success "Daily backup created: $DAILY_FILE ($BACKUP_SIZE)"
else
    log_error "Daily backup failed"
    exit 1
fi

# Create weekly backup (on Sundays)
if [ "$DAY_OF_WEEK" -eq 7 ]; then
    log "Creating weekly backup..."
    WEEKLY_FILE="$BACKUP_DIR/weekly/$WEEKLY_BACKUP"
    cp "$DAILY_FILE" "$WEEKLY_FILE"
    log_success "Weekly backup created: $WEEKLY_FILE"
fi

# Create monthly backup (on 1st day of month)
if [ "$DAY_OF_MONTH" -eq 1 ]; then
    log "Creating monthly backup..."
    MONTHLY_FILE="$BACKUP_DIR/monthly/$MONTHLY_BACKUP"
    cp "$DAILY_FILE" "$MONTHLY_FILE"
    log_success "Monthly backup created: $MONTHLY_FILE"
fi

# Verify backup integrity
log "Verifying backup integrity..."
if pg_restore --list "$DAILY_FILE" > /dev/null 2>&1; then
    log_success "Backup integrity verified"
else
    log_error "Backup integrity check failed"
    exit 1
fi

# Apply retention policy
log "Applying retention policy..."

# Remove daily backups older than RETENTION_DAYS
find "$BACKUP_DIR/daily" -name "daily_*.sql.gz" -mtime +$RETENTION_DAYS -delete
REMOVED_DAILY=$(find "$BACKUP_DIR/daily" -name "daily_*.sql.gz" -mtime +$RETENTION_DAYS 2>/dev/null | wc -l)
log_success "Removed $REMOVED_DAILY old daily backups (>$RETENTION_DAYS days)"

# Remove weekly backups older than RETENTION_WEEKS weeks
RETENTION_WEEKS_DAYS=$((RETENTION_WEEKS * 7))
find "$BACKUP_DIR/weekly" -name "weekly_*.sql.gz" -mtime +$RETENTION_WEEKS_DAYS -delete
log_success "Removed old weekly backups (>$RETENTION_WEEKS weeks)"

# Remove monthly backups older than RETENTION_MONTHS months
RETENTION_MONTHS_DAYS=$((RETENTION_MONTHS * 30))
find "$BACKUP_DIR/monthly" -name "monthly_*.sql.gz" -mtime +$RETENTION_MONTHS_DAYS -delete
log_success "Removed old monthly backups (>$RETENTION_MONTHS months)"

# Upload to S3 (if enabled)
if [ "$S3_ENABLED" = "true" ]; then
    log "Uploading backup to S3..."
    
    if command -v aws &> /dev/null; then
        aws s3 cp "$DAILY_FILE" \
            "s3://$S3_BUCKET/postgresql/daily/" \
            --region "$S3_REGION" \
            --storage-class STANDARD_IA
        
        if [ $? -eq 0 ]; then
            log_success "Backup uploaded to S3: s3://$S3_BUCKET/postgresql/daily/"
        else
            log_error "Failed to upload backup to S3"
        fi
    else
        log_warning "AWS CLI not installed, skipping S3 upload"
    fi
fi

# Generate backup report
log ""
log "╔════════════════════════════════════════════════╗"
log "║           Backup Report Summary                ║"
log "╚════════════════════════════════════════════════╝"

DAILY_COUNT=$(ls -1 "$BACKUP_DIR/daily" | wc -l)
WEEKLY_COUNT=$(ls -1 "$BACKUP_DIR/weekly" | wc -l)
MONTHLY_COUNT=$(ls -1 "$BACKUP_DIR/monthly" | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

log "Daily backups: $DAILY_COUNT"
log "Weekly backups: $WEEKLY_COUNT"
log "Monthly backups: $MONTHLY_COUNT"
log "Total backup size: $TOTAL_SIZE"
log ""
log_success "Backup completed successfully!"
log ""

# Cleanup old logs (keep 30 days)
find "$BACKUP_DIR/logs" -name "backup_*.log" -mtime +30 -delete

# Unset password
unset PGPASSWORD

exit 0
