/**
 * Error Handling Middleware - Sara Learning Platform
 * Industry-level error handling with proper logging and user feedback
 */

import { createErrorResponse } from '../utils/responses.js'

// ============ ERROR TYPES ============

export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.statusCode = 400
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
    this.statusCode = 401
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Access denied') {
    super(message)
    this.name = 'AuthorizationError'
    this.statusCode = 403
  }
}

export class NotFoundError extends Error {
  constructor(resource = 'Resource') {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
    this.statusCode = 404
  }
}

export class ConflictError extends Error {
  constructor(message = 'Resource conflict') {
    super(message)
    this.name = 'ConflictError'
    this.statusCode = 409
  }
}

export class RateLimitError extends Error {
  constructor(message = 'Rate limit exceeded') {
    super(message)
    this.name = 'RateLimitError'
    this.statusCode = 429
  }
}

export class DatabaseError extends Error {
  constructor(message = 'Database operation failed') {
    super(message)
    this.name = 'DatabaseError'
    this.statusCode = 500
  }
}

export class ExternalServiceError extends Error {
  constructor(service, message = 'External service error') {
    super(`${service}: ${message}`)
    this.name = 'ExternalServiceError'
    this.service = service
    this.statusCode = 502
  }
}

// ============ ERROR HANDLER MIDDLEWARE ============

export function errorHandler(error, req, res, next) {
  // Log error details
  console.error(`[${new Date().toISOString()}] ERROR:`, {
    name: error.name,
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.userId,
    ip: req.ip
  })

  // Handle known error types
  if (error.statusCode) {
    return res.status(error.statusCode).json(createErrorResponse(error.message, {
      type: error.name,
      field: error.field,
      service: error.service
    }))
  }

  // Handle specific error cases
  if (error.name === 'ValidationError') {
    return res.status(400).json(createErrorResponse(error.message, {
      type: 'ValidationError',
      field: error.field
    }))
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json(createErrorResponse('Invalid token'))
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json(createErrorResponse('Token expired'))
  }

  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json(createErrorResponse('Service temporarily unavailable'))
  }

  if (error.code === 'ENOTFOUND') {
    return res.status(502).json(createErrorResponse('External service unreachable'))
  }

  // Database errors
  if (error.code === '23505') { // Unique constraint violation
    return res.status(409).json(createErrorResponse('Resource already exists'))
  }

  if (error.code === '23503') { // Foreign key violation
    return res.status(400).json(createErrorResponse('Invalid reference'))
  }

  if (error.code === '23502') { // Not null violation
    return res.status(400).json(createErrorResponse('Required field missing'))
  }

  // Default server error
  res.status(500).json(createErrorResponse(
    process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined
  ))
}

// ============ ASYNC ERROR WRAPPER ============

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// ============ ERROR LOGGING ============

export function logError(error, context = {}) {
  console.error(`[${new Date().toISOString()}] ERROR:`, {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...context
  })
}

// ============ ERROR UTILITIES ============

export function createError(message, statusCode = 500, type = 'Error') {
  const error = new Error(message)
  error.statusCode = statusCode
  error.name = type
  return error
}

export function isOperationalError(error) {
  return error.statusCode && error.statusCode < 500
}

export default {
  errorHandler,
  asyncHandler,
  logError,
  createError,
  isOperationalError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError
}