#!/bin/bash

# ASTOR AI - Redis Backup Script
# Automated Redis RDB backup with compression
# Date: January 2, 2026

set -e

# Configuration
REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"
REDIS_PASSWORD="${REDIS_PASSWORD:-}"
REDIS_DATA_DIR="${REDIS_DATA_DIR:-/var/lib/redis}"

# Backup settings
BACKUP_DIR="${BACKUP_DIR:-/var/backups/astor-ai/redis}"
RETENTION_DAYS=7

# S3 settings (optional)
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
BACKUP_FILE="redis_${TIMESTAMP}.rdb.gz"
LOG_FILE="$BACKUP_DIR/logs/redis_backup_$(date +%Y-%m-%d).log"

# Create backup directories
mkdir -p "$BACKUP_DIR/snapshots"
mkdir -p "$BACKUP_DIR/logs"

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

# Start backup
log "╔════════════════════════════════════════════════╗"
log "║      ASTOR AI - Redis Backup Starting         ║"
log "╚════════════════════════════════════════════════╝"
log ""
log "Redis Host: $REDIS_HOST:$REDIS_PORT"
log "Backup Directory: $BACKUP_DIR"
log ""

# Check if Redis is accessible
log "Checking Redis connection..."

REDIS_CMD="redis-cli -h $REDIS_HOST -p $REDIS_PORT"
if [ -n "$REDIS_PASSWORD" ]; then
    REDIS_CMD="$REDIS_CMD -a $REDIS_PASSWORD"
fi

if $REDIS_CMD ping > /dev/null 2>&1; then
    log_success "Redis is accessible"
else
    log_error "Cannot connect to Redis"
    exit 1
fi

# Trigger BGSAVE
log "Triggering background save (BGSAVE)..."
$REDIS_CMD BGSAVE > /dev/null 2>&1

# Wait for BGSAVE to complete
log "Waiting for background save to complete..."
while true; do
    LASTSAVE=$($REDIS_CMD LASTSAVE)
    sleep 2
    CURRENT_SAVE=$($REDIS_CMD LASTSAVE)
    
    if [ "$CURRENT_SAVE" -gt "$LASTSAVE" ]; then
        log_success "Background save completed"
        break
    fi
    
    # Timeout after 5 minutes
    ELAPSED=$(($(date +%s) - START_TIME))
    if [ $ELAPSED -gt 300 ]; then
        log_error "Background save timeout"
        exit 1
    fi
done

# Copy and compress RDB file
log "Copying and compressing RDB file..."
RDB_FILE="$REDIS_DATA_DIR/dump.rdb"

if [ ! -f "$RDB_FILE" ]; then
    log_error "RDB file not found: $RDB_FILE"
    exit 1
fi

BACKUP_PATH="$BACKUP_DIR/snapshots/$BACKUP_FILE"
gzip -c "$RDB_FILE" > "$BACKUP_PATH"

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    log_success "Backup created: $BACKUP_PATH ($BACKUP_SIZE)"
else
    log_error "Backup compression failed"
    exit 1
fi

# Apply retention policy
log "Applying retention policy..."
find "$BACKUP_DIR/snapshots" -name "redis_*.rdb.gz" -mtime +$RETENTION_DAYS -delete
log_success "Removed old backups (>$RETENTION_DAYS days)"

# Upload to S3 (if enabled)
if [ "$S3_ENABLED" = "true" ]; then
    log "Uploading backup to S3..."
    
    if command -v aws &> /dev/null; then
        aws s3 cp "$BACKUP_PATH" \
            "s3://$S3_BUCKET/redis/snapshots/" \
            --region "$S3_REGION" \
            --storage-class STANDARD_IA
        
        if [ $? -eq 0 ]; then
            log_success "Backup uploaded to S3"
        else
            log_error "Failed to upload backup to S3"
        fi
    else
        log "AWS CLI not installed, skipping S3 upload"
    fi
fi

# Generate report
log ""
log "╔════════════════════════════════════════════════╗"
log "║           Backup Report Summary                ║"
log "╚════════════════════════════════════════════════╝"

BACKUP_COUNT=$(ls -1 "$BACKUP_DIR/snapshots" | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR/snapshots" | cut -f1)

log "Total backups: $BACKUP_COUNT"
log "Total size: $TOTAL_SIZE"
log ""
log_success "Redis backup completed successfully!"
log ""

# Cleanup old logs
find "$BACKUP_DIR/logs" -name "redis_backup_*.log" -mtime +30 -delete

exit 0
