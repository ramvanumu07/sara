# EduBridge Backend API

> Industry-level Node.js backend for the EduBridge educational platform

## 🏗️ Architecture

This is a professional, enterprise-grade backend built with:

- **Express.js** - Web framework with comprehensive middleware stack
- **Supabase** - PostgreSQL database with real-time capabilities
- **GROQ AI** - Advanced language model integration
- **Winston** - Professional logging system
- **Jest** - Comprehensive testing framework
- **ESLint + Prettier** - Code quality and formatting
- **Joi** - Input validation and sanitization

## 🚀 Features

- ✅ **Professional Architecture** - Service layer, dependency injection, error handling
- ✅ **Security First** - Helmet, CORS, rate limiting, input sanitization
- ✅ **Comprehensive Logging** - Structured logging with correlation IDs
- ✅ **Error Handling** - Standardized error types and responses
- ✅ **Input Validation** - Joi schemas with sanitization
- ✅ **Testing** - Unit tests with mocking and coverage reports
- ✅ **Code Quality** - ESLint, Prettier, pre-commit hooks
- ✅ **Health Checks** - Service monitoring and status endpoints
- ✅ **Graceful Shutdown** - Proper cleanup on termination
- ✅ **Performance** - Compression, caching, optimized database queries

## 📁 Project Structure

```
src/
├── config/           # Configuration management
├── middleware/       # Express middleware
├── routes/          # API route handlers
├── services/        # Business logic services
├── utils/           # Utility functions
└── server.js        # Application entry point

tests/               # Test suites
scripts/             # Build and deployment scripts
```

## 🛠️ Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Supabase account
- GROQ API key

### Quick Start

1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd backend
   npm run setup
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Set up database:**
   - Run the SQL schema in your Supabase dashboard
   - Update database URLs in .env

4. **Start development:**
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port | No (default: 5000) |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |
| `GROQ_API_KEY` | GROQ AI API key | Yes |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Yes |
| `FRONTEND_URL` | Frontend application URL | No |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | No |

### Example .env

```env
NODE_ENV=development
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
GROQ_API_KEY=your-groq-api-key
JWT_SECRET=your-very-secure-jwt-secret-at-least-32-characters
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=info
```

## 🗄️ Database Schema

The application uses the following main tables:

- **users** - User accounts and authentication
- **progress** - Learning progress tracking
- **chat_sessions** - Conversation storage (optimized format)
- **admins** - Admin user privileges

Run the schema files in your Supabase SQL editor:
1. `database/fresh-schema.sql` - Complete schema
2. `database/chat-sessions-schema.sql` - Optimized chat storage

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run start        # Start production server
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify JWT token

#### Learning
- `POST /api/learn/session/start` - Start learning session
- `POST /api/learn/session/chat` - Chat in session
- `POST /api/learn/playtime/start` - Start playground
- `POST /api/learn/playtime/execute` - Execute code
- `POST /api/learn/assignment/submit` - Submit assignment

#### System
- `GET /health` - Basic health check
- `GET /api/status` - Detailed service status

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- AIService.test.js

# Run tests in watch mode
npm run test:watch
```

### Test Structure

- **Unit Tests** - Individual service and utility testing
- **Integration Tests** - API endpoint testing
- **Mocking** - External services are mocked for reliability
- **Coverage** - Minimum 80% coverage enforced

## 📊 Monitoring

### Health Checks

- `GET /health` - Basic server health
- `GET /api/status` - Detailed service status including:
  - Database connectivity
  - AI service status
  - Memory usage
  - Uptime

### Logging

Structured logging with correlation IDs:

```javascript
logger.info('Request completed', {
  method: 'POST',
  path: '/api/learn/session/chat',
  statusCode: 200,
  duration: 1250,
  correlationId: 'req-123-456'
})
```

### Error Tracking

Professional error handling with:
- Standardized error types
- Correlation ID tracking
- Stack trace capture (development only)
- Structured error responses

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret (32+ characters)
- [ ] Configure proper CORS origins
- [ ] Set up log aggregation
- [ ] Enable database connection pooling
- [ ] Configure reverse proxy (nginx/CloudFlare)
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔒 Security

### Implemented Security Measures

- **Helmet.js** - Security headers
- **CORS** - Cross-origin request control
- **Rate Limiting** - Request throttling
- **Input Validation** - Joi schema validation
- **Input Sanitization** - XSS prevention
- **JWT Authentication** - Secure token-based auth
- **Error Handling** - No information leakage

### Security Best Practices

1. Keep dependencies updated
2. Use HTTPS in production
3. Implement proper session management
4. Regular security audits
5. Monitor for suspicious activity

## 📈 Performance

### Optimizations Implemented

- **Compression** - Gzip response compression
- **Caching** - AI response caching
- **Database** - Optimized queries and indexing
- **Memory Management** - Efficient chat storage
- **Request Batching** - Reduced database calls

### Performance Monitoring

Monitor these metrics:
- Response times
- Memory usage
- Database query performance
- AI service latency
- Error rates

## 🤝 Contributing

### Code Style

- Use ESLint and Prettier configurations
- Follow conventional commit messages
- Write tests for new features
- Update documentation

### Pull Request Process

1. Create feature branch
2. Write tests
3. Ensure all tests pass
4. Update documentation
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Check the documentation
- Review error logs with correlation IDs
- Use health check endpoints for diagnostics
- Contact the development team

---

**Built with ❤️ for professional education technology**