/**
 * EduBridge API Server - Industry Level
 * Professional Express.js server with proper architecture
 */

import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { createServer } from 'http'

// Initialize industry-grade services
import { initializeErrorTracking } from './services/errorTracking.js'
import { initializeCache } from './services/cache.js'
import { logInfo, logError } from './services/logger.js'
import requestIdMiddleware from './middleware/requestId.js'
import { performanceMiddleware } from './services/performanceMonitor.js'

// Import routes
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import learningRoutes from './routes/learning.js'
import progressRoutes from './routes/progress.js'
import debugSchemaRoutes from './routes/debug-schema.js'
import debugChatRoutes from './routes/debug-chat.js'

// Import middleware
import { performanceMonitor } from './middleware/performance.js'
import { errorHandler } from './middleware/errorHandler.js'
import { getPerformanceStats } from './services/performanceMonitor.js'

// Import utilities
import { getSafePort } from './utils/portManager.js'

// Initialize services
initializeErrorTracking()
initializeCache()

const app = express()
const PREFERRED_PORT = parseInt(process.env.PORT) || 5000

// ============ CORS CONFIGURATION ============
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178',
      'http://localhost:3000'
    ]

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
    return callback(new Error(msg), false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Correlation-ID',
  ],
  optionsSuccessStatus: 200
}))

// ============ REQUEST TRACKING ============
app.use(requestIdMiddleware)
app.use(performanceMiddleware)

// ============ SECURITY MIDDLEWARE ============
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// ============ PERFORMANCE MIDDLEWARE ============
app.use(compression({
  level: 6,
  threshold: 1024,
}))

// ============ BODY PARSING ============
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ============ PERFORMANCE MONITORING ============
app.use(performanceMonitor)

// ============ ROUTES ============
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/learn', learningRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/debug', debugSchemaRoutes)
app.use('/api/debug', debugChatRoutes)

// ============ ERROR HANDLING ============
app.use(errorHandler)

// ============ HEALTH CHECK ============
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.1',
    memory: process.memoryUsage()
  })
})

// Performance metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    status: 'success',
    data: getPerformanceStats(),
    timestamp: new Date().toISOString()
  })
})

// ============ ERROR HANDLING ============
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message)

  const isDevelopment = process.env.NODE_ENV === 'development'

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  })
})

// ============ 404 HANDLER ============
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  })
})

// ============ SERVER STARTUP WITH ROBUST PORT MANAGEMENT ============
const startServer = async () => {
  try {
    // Get a safe port (try preferred, find alternative if needed)
    const PORT = await getSafePort(PREFERRED_PORT, true)
    
    const server = createServer(app)
    
    server.listen(PORT, () => {
  // Log server startup with structured logging
  logInfo('Sara Learning Platform API Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    cors: process.env.NODE_ENV === 'production' ? 'production domains' : 'localhost development',
    services: {
      errorTracking: !!process.env.SENTRY_DSN,
      redis: !!process.env.REDIS_URL,
      database: !!process.env.SUPABASE_URL,
      logging: 'winston',
      caching: process.env.REDIS_URL ? 'redis' : 'memory'
    }
  })
  
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    Sara Learning Platform                    ║
║                    Industry Grade v2.0                      ║
╠══════════════════════════════════════════════════════════════╣
║  Server:      http://localhost:${PORT.toString().padEnd(29)} ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(29)} ║
║  Status:      Production Ready                               ║
║  Health:      http://localhost:${PORT}/health${' '.repeat(18)} ║
║  Services:    ${(process.env.REDIS_URL ? 'Redis' : 'Memory').padEnd(29)} ║
║  Monitoring:  ${(process.env.SENTRY_DSN ? 'Sentry' : 'Console').padEnd(29)} ║
╚══════════════════════════════════════════════════════════════╝
  `)
    })

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logError(`Port ${PORT} is already in use after cleanup attempt`, {
          solutions: [
            `Kill the process manually: taskkill /PID <pid> /F`,
            `Use different port: PORT=5001 npm run dev`,
            `Check running processes: netstat -ano | findstr :${PORT}`
          ]
        })
      } else {
        logError('Server startup error', { error: error.message })
      }
      process.exit(1)
    })

    // ============ GRACEFUL SHUTDOWN ============
    const gracefulShutdown = (signal) => {
      console.log(`\n[${new Date().toISOString()}] Received ${signal}. Starting graceful shutdown...`)

      server.close(() => {
        console.log(`[${new Date().toISOString()}] Server closed successfully.`)
        process.exit(0)
      })

      // Force close after 10 seconds
      setTimeout(() => {
        console.log(`[${new Date().toISOString()}] Force closing server.`)
        process.exit(1)
      }, 10000)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
    
  } catch (error) {
    logError('Failed to start server', { error: error.message })
    console.error('❌ Could not find an available port. Please check your system.')
    process.exit(1)
  }
}

// Start the server
startServer()

export default app