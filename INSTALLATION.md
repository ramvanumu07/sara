# 🚀 Sara Learning Platform - Industry-Grade Installation Guide

## 📋 Prerequisites

- **Node.js 18+** (Required)
- **npm 8+** or **yarn 1.22+** (Required)
- **Redis** (Optional - will use memory cache fallback)
- **PostgreSQL** (via Supabase)

## 🎯 Quick Installation

### Option 1: Automated Installation (Recommended)

```bash
# Run the automated installation script
node scripts/install-dependencies.js
```

### Option 2: Manual Installation

#### Backend Dependencies:
```bash
cd backend
npm install
```

#### Frontend Dependencies:
```bash
cd frontend
npm install
```

## 🔧 Environment Setup

### 1. Backend Environment (.env)
```bash
cd backend
cp .env.example .env
# Edit .env with your actual values
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_KEY` - Your Supabase service key
- `JWT_SECRET` - Random 32+ character string

Optional variables:
- `REDIS_URL` - Redis connection string (uses memory cache if not provided)
- `SENTRY_DSN` - Sentry error tracking DSN
- `GROQ_API_KEY` - AI service API key

### 2. Frontend Environment (.env)
```bash
cd frontend
cp .env.example .env
# Edit .env with your actual values
```

## 🧪 Verify Installation

### Run Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Start Development Servers
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

## 🛡️ Fallback Systems

Sara includes industry-grade fallback systems:

### Error Tracking
- **Primary**: Sentry (if configured)
- **Fallback**: Console logging with structured format

### Caching
- **Primary**: Redis (if available)
- **Fallback**: In-memory cache with TTL

### Logging
- **Primary**: Winston with file rotation
- **Fallback**: Enhanced console logging

### Rate Limiting
- **Primary**: Distributed Redis-based
- **Fallback**: In-memory rate limiting

## 🚀 Production Deployment

### 1. Build Applications
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### 2. Environment Variables
Set these in your production environment:
- `NODE_ENV=production`
- `REDIS_URL` (recommended for production)
- `SENTRY_DSN` (recommended for error tracking)

### 3. Start Production Server
```bash
cd backend && npm start
```

## 🔍 Troubleshooting

### Common Issues:

#### 1. Node.js Version Error
```bash
# Check version
node --version

# Should be 18.0.0 or higher
# Update Node.js if needed
```

#### 2. Permission Errors
```bash
# On Windows (run as Administrator)
npm install --global windows-build-tools

# On macOS/Linux
sudo npm install
```

#### 3. Redis Connection Issues
```bash
# Redis is optional - the app will work without it
# To install Redis locally:

# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis

# Windows
# Download from: https://github.com/microsoftarchive/redis/releases
```

#### 4. Database Connection Issues
- Verify Supabase URL and service key
- Check network connectivity
- Ensure database is accessible

### 5. Missing Dependencies
The application includes graceful fallbacks for all optional dependencies:
- Missing Sentry → Uses console logging
- Missing Redis → Uses memory cache
- Missing Winston → Uses console logging

## 📊 Health Checks

### Backend Health Check
```bash
curl http://localhost:5000/health
```

### Frontend Health Check
```bash
curl http://localhost:5173
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Redis server running (recommended)
- [ ] Sentry error tracking configured
- [ ] SSL certificates installed
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] CI/CD pipeline tested
- [ ] Load balancer configured (if needed)

## 📞 Support

If you encounter issues:

1. Check the logs in `backend/logs/`
2. Verify all environment variables
3. Ensure all required services are running
4. Check the troubleshooting section above

The application is designed to work with minimal configuration and gracefully handle missing optional services.