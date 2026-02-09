/**
 * Structured Logging Service
 * Professional logging with different levels and structured output
 */

import winston from 'winston'
import path from 'path'

const { combine, timestamp, errors, json, printf, colorize } = winston.format

// Custom format for development
const devFormat = printf(({ level, message, timestamp, requestId, ...meta }) => {
  let log = `${timestamp} [${level}]`
  
  if (requestId) {
    log += ` [${requestId}]`
  }
  
  log += `: ${message}`
  
  if (Object.keys(meta).length > 0) {
    log += ` ${JSON.stringify(meta)}`
  }
  
  return log
})

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: {
    service: 'sara-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Write all logs to files
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
})

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'HH:mm:ss' }),
      devFormat
    )
  }))
}

// Helper functions for different log levels
export const logInfo = (message, meta = {}) => {
  logger.info(message, meta)
}

export const logError = (message, error = null, meta = {}) => {
  const logData = { ...meta }
  
  if (error) {
    logData.error = {
      message: error.message,
      stack: error.stack,
      name: error.name
    }
  }
  
  logger.error(message, logData)
}

export const logWarn = (message, meta = {}) => {
  logger.warn(message, meta)
}

export const logDebug = (message, meta = {}) => {
  logger.debug(message, meta)
}

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now()
  
  // Log request start
  logInfo('Request started', {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.userId
  })
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start
    const level = res.statusCode >= 400 ? 'warn' : 'info'
    
    logger.log(level, 'Request completed', {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.userId
    })
  })
  
  next()
}

// Database query logger
export const logDatabaseQuery = (query, duration, error = null) => {
  if (error) {
    logError('Database query failed', error, {
      query: query.substring(0, 200), // Truncate long queries
      duration: `${duration}ms`
    })
  } else if (duration > 1000) { // Log slow queries
    logWarn('Slow database query', {
      query: query.substring(0, 200),
      duration: `${duration}ms`
    })
  } else {
    logDebug('Database query executed', {
      query: query.substring(0, 100),
      duration: `${duration}ms`
    })
  }
}

// Authentication events logger
export const logAuthEvent = (event, userId, details = {}) => {
  logInfo(`Auth event: ${event}`, {
    userId,
    event,
    ...details
  })
}

// Security events logger
export const logSecurityEvent = (event, details = {}) => {
  logWarn(`Security event: ${event}`, {
    event,
    ...details
  })
}

export default logger