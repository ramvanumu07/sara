// Request logging middleware with request IDs
import crypto from 'crypto'

/**
 * Generate a short unique request ID
 */
function generateRequestId() {
  return crypto.randomBytes(8).toString('hex')
}

/**
 * Format duration in ms
 */
function formatDuration(startTime) {
  const duration = Date.now() - startTime
  return duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(2)}s`
}

/**
 * Request logging middleware
 * Adds request ID to all requests and logs request/response info
 */
export function requestLogger(req, res, next) {
  // Generate and attach request ID
  const requestId = generateRequestId()
  req.requestId = requestId
  res.setHeader('X-Request-ID', requestId)
  
  const startTime = Date.now()
  const { method, path, query } = req
  
  // Log request start
  const queryStr = Object.keys(query).length > 0 ? ` ?${new URLSearchParams(query)}` : ''
  console.log(`[${requestId}] → ${method} ${path}${queryStr}`)
  
  // Capture response
  const originalSend = res.send
  res.send = function(body) {
    const duration = formatDuration(startTime)
    const status = res.statusCode
    const statusIcon = status < 400 ? '✓' : '✗'
    
    console.log(`[${requestId}] ← ${statusIcon} ${status} (${duration})`)
    
    return originalSend.call(this, body)
  }
  
  next()
}

/**
 * Error logging middleware
 * Should be added after routes
 */
export function errorLogger(err, req, res, next) {
  const requestId = req.requestId || 'unknown'
  console.error(`[${requestId}] ERROR:`, err.message)
  console.error(err.stack)
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      requestId
    }
  })
}
