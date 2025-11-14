FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    postgresql-client \
    libpq-dev \
    curl \
    wget \
    git \
    build-essential \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download Swiss Ephemeris data (optional - swisseph works with built-in data too)
RUN mkdir -p /app/ephemeris/data && \
    cd /app/ephemeris/data && \
    (wget --timeout=10 --tries=2 https://www.astro.com/ftp/swisseph/ephe/seas_18.se1 2>/dev/null || true) && \
    (wget --timeout=10 --tries=2 https://www.astro.com/ftp/swisseph/ephe/semo_18.se1 2>/dev/null || true) && \
    (wget --timeout=10 --tries=2 https://www.astro.com/ftp/swisseph/ephe/sepl_18.se1 2>/dev/null || true) && \
    echo "Swiss Ephemeris data download attempted (optional)"

# Copy application
COPY . .

# Create necessary directories
RUN mkdir -p /app/logs /app/reports/generated /app/uploads

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/healthz || exit 1

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
