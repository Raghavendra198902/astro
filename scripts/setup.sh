#!/bin/bash
# Astor AI - Project Initialization Script
# Run this script to set up the complete development environment

set -e  # Exit on error

echo "========================================="
echo "Astor AI - Project Initialization"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."

command -v docker >/dev/null 2>&1 || { print_error "Docker is required but not installed. Aborting."; exit 1; }
print_success "Docker is installed"

command -v docker-compose >/dev/null 2>&1 || { print_error "Docker Compose is required but not installed. Aborting."; exit 1; }
print_success "Docker Compose is installed"

command -v python3 >/dev/null 2>&1 || { print_error "Python 3 is required but not installed. Aborting."; exit 1; }
print_success "Python 3 is installed"

command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed. Aborting."; exit 1; }
print_success "Node.js is installed"

echo ""

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating .env file from template..."
    cp .env.example .env
    
    # Generate secret key
    SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')
    sed -i "s/your-super-secret-key-min-32-chars-change-this-in-production/$SECRET_KEY/" .env
    
    print_success ".env file created with generated secret key"
else
    print_info ".env file already exists"
fi

echo ""

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p backend/logs
mkdir -p backend/reports/generated
mkdir -p backend/uploads
mkdir -p backend/ephemeris/data
mkdir -p frontend/.next
mkdir -p infra/docker/nginx/conf.d

print_success "Directories created"

echo ""

# Start infrastructure services
print_info "Starting infrastructure services (PostgreSQL, Redis, RabbitMQ)..."
docker-compose up -d postgres redis rabbitmq

echo "Waiting for services to be ready..."
sleep 10

print_success "Infrastructure services started"

echo ""

# Backend setup
print_info "Setting up Python backend..."

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_success "Python virtual environment created"
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
print_info "Installing Python dependencies (this may take a few minutes)..."
pip install --upgrade pip
pip install -r requirements.txt
print_success "Python dependencies installed"

# Run database migrations
print_info "Running database migrations..."
alembic upgrade head
print_success "Database migrations completed"

cd ..

echo ""

# Frontend setup (optional - commented out for now)
print_info "Frontend setup will be done separately with Next.js"
echo "To set up frontend manually:"
echo "  cd frontend"
echo "  npm install"
echo "  npm run dev"

echo ""

# Create initial admin user
print_info "Creating initial admin user..."
cat > backend/create_admin.py << 'EOF'
import asyncio
from app.core.database import AsyncSessionLocal
from app.models import User
from app.core.security import hash_password
from app.models.models import UserRole
import uuid

async def create_admin():
    async with AsyncSessionLocal() as db:
        # Check if admin exists
        from sqlalchemy import select
        result = await db.execute(select(User).where(User.email == "admin@astorai.com"))
        existing = result.scalar_one_or_none()
        
        if existing:
            print("Admin user already exists")
            return
        
        # Create admin user
        admin = User(
            id=uuid.uuid4(),
            email="admin@astorai.com",
            hashed_password=hash_password("Admin@123"),
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        db.add(admin)
        await db.commit()
        print("Admin user created successfully")
        print("Email: admin@astorai.com")
        print("Password: Admin@123")
        print("⚠️  CHANGE THIS PASSWORD IMMEDIATELY IN PRODUCTION!")

if __name__ == "__main__":
    asyncio.run(create_admin())
EOF

cd backend
source venv/bin/activate
python create_admin.py
rm create_admin.py
cd ..

print_success "Initial admin user created"

echo ""
echo "========================================="
echo "✓ Astor AI Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend server:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload"
echo ""
echo "2. Access the API documentation:"
echo "   http://localhost:8000/docs"
echo ""
echo "3. Admin credentials (CHANGE IN PRODUCTION):"
echo "   Email: admin@astorai.com"
echo "   Password: Admin@123"
echo ""
echo "4. For production deployment:"
echo "   - Update .env with production values"
echo "   - Set up proper SSL certificates"
echo "   - Configure external secrets management"
echo "   - Set up monitoring and logging"
echo ""
echo "========================================="
