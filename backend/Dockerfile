# Multi-stage build for optimized image size
# Stage 1: Build dependencies
FROM python:3.11-slim as builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies to /opt/venv
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# Stage 2: Runtime image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install only runtime dependencies (smaller footprint)
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq5 \
    curl \
    libglib2.0-0 \
    libglib2.0-dev \
    libgirepository-1.0-1 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    libgl1 \
    libgdk-pixbuf-2.0-0 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Create non-root user for security
RUN useradd -m -u 1000 astor && \
    mkdir -p /app/logs /app/reports/generated /app/uploads /app/ephemeris/data && \
    chown -R astor:astor /app

# Download Swiss Ephemeris data (optional)
RUN cd /app/ephemeris/data && \
    (curl -f -s --max-time 10 -O https://www.astro.com/ftp/swisseph/ephe/seas_18.se1 || true) && \
    (curl -f -s --max-time 10 -O https://www.astro.com/ftp/swisseph/ephe/semo_18.se1 || true) && \
    (curl -f -s --max-time 10 -O https://www.astro.com/ftp/swisseph/ephe/sepl_18.se1 || true) && \
    echo "Swiss Ephemeris data downloaded (optional)"

# Copy application code
COPY --chown=astor:astor . .

# Switch to non-root user
USER astor

# Expose port
EXPOSE 8000

# Health check with better defaults
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/healthz || exit 1

# Resource limits (can be overridden in docker-compose)
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Default command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
