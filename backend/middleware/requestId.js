/**
 * Request ID Middleware
 * Adds unique request ID for error tracking and debugging
 */

import { v4 as uuidv4 } from 'uuid'

export const requestIdMiddleware = (req, res, next) => {
  // Generate unique request ID
  const requestId = uuidv4()
  
  // Add to request object
  req.requestId = requestId
  
  // Add to response headers for client-side debugging
  res.setHeader('X-Request-ID', requestId)
  
  // Log request start
  console.log(`[${requestId}] ${req.method} ${req.originalUrl} - Started`)
  
  // Override console.log to include request ID
  const originalConsoleLog = console.log
  req.log = (...args) => {
    originalConsoleLog(`[${requestId}]`, ...args)
  }
  
  next()
}

export default requestIdMiddleware