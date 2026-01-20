# WorkTime Backend Setup Guide

## Prerequisites

You need to have these installed:
- **Docker Desktop** (includes Docker and Docker Compose)
  - Download: https://www.docker.com/products/docker-desktop/
  - Make sure Docker is running
- **Node.js 20+** (for local development without Docker)
  - Download: https://nodejs.org/

## Quick Start (Docker - Recommended)

### Step 1: Set up environment variables
```bash
# Copy the example env file
cd backend
cp .env.example .env
```

Edit `.env` if needed (defaults work fine for local dev).

### Step 2: Start all services
```bash
# From the project root directory
docker-compose up --build
```

This will:
- ✅ Start PostgreSQL database on port 5432
- ✅ Run database migrations automatically
- ✅ Start backend API on port 5000
- ✅ Start frontend on port 3000

### Step 3: Verify everything works
Open these URLs in your browser:
- **Frontend**: http://localhost:3000
- **Backend Health**: http://localhost:5000/health
- **Backend API**: http://localhost:5000/api

You should see:
- Frontend loads (your React app)
- Health check returns `{"status": "healthy", "database": "connected"}`
- API info shows available endpoints

## Local Development (Without Docker)

If you prefer to run things locally:

### Step 1: Start PostgreSQL
You need PostgreSQL running locally. Either:
- Use Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=worktime postgres:15-alpine`
- Or install PostgreSQL locally

### Step 2: Install backend dependencies
```bash
cd backend
npm install
```

### Step 3: Run database migrations
```bash
psql -U postgres -d worktime -f src/db/schema.sql
```

### Step 4: Start backend in dev mode
```bash
npm run dev
```

Backend will run on http://localhost:5000 with hot reload.

### Step 5: Start frontend
```bash
cd ..
npm run dev
```

Frontend will run on http://localhost:5173

## Database Access

### View database tables
```bash
# Connect to database
docker exec -it worktime-db psql -U postgres -d worktime

# List tables
\dt

# View users table
SELECT * FROM users;

# Exit
\q
```

### Run SQL queries
```bash
# From your terminal
docker exec -it worktime-db psql -U postgres -d worktime -c "SELECT COUNT(*) FROM sessions;"
```

## Common Commands

### Docker
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Reset everything (WARNING: deletes data)
docker-compose down -v
docker-compose up --build
```

### Backend Development
```bash
cd backend

# Install dependencies
npm install

# Run in dev mode (hot reload)
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start
```

## Testing the Setup

### 1. Test database connection
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-18T06:56:55.000Z",
  "database": "connected"
}
```

### 2. Test API
```bash
curl http://localhost:5000/api
```

Expected response:
```json
{
  "message": "WorkTime API v1.0",
  "endpoints": {
    "health": "/health",
    "auth": "/api/auth/*",
    "sessions": "/api/sessions",
    "projects": "/api/projects",
    "analytics": "/api/analytics"
  }
}
```

## Troubleshooting

### "Port already in use"
If you see port conflict errors:
```bash
# Stop all Docker containers
docker-compose down

# Check what's using the port
# Windows:
netstat -ano | findstr :5432
# Kill the process if needed
```

### "Database connection failed"
```bash
# Check if Postgres is running
docker-compose ps

# View Postgres logs
docker-compose logs postgres

# Restart Postgres
docker-compose restart postgres
```

### "Cannot find module errors" in backend
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
docker-compose up --build
```

## What's Next?

You've completed **Day 1: Backend Foundation**! 🎉

Your setup includes:
- ✅ Express TypeScript backend
- ✅ PostgreSQL database with proper schema
- ✅ Docker containerization
- ✅ Health checks and error handling

**Next Steps (Day 2):**
- Add authentication (JWT)
- Create CRUD endpoints for sessions
- Build API client in frontend
- Connect React app to backend

See `portfolio_feature_plan.md` for the full roadmap.

## Project Structure

```
WorkTime/
├── backend/
│   ├── src/
│   │   ├── server.ts          # Express app entry point
│   │   ├── config/
│   │   │   └── database.ts    # PostgreSQL connection
│   │   └── db/
│   │       ├── schema.sql     # Database schema
│   │       └── init.sql       # Initialization script
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
├── src/                        # React frontend
├── docker-compose.yml
├── Dockerfile                  # Frontend Dockerfile
└── nginx.conf                  # Nginx config
```
