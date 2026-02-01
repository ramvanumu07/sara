/**
 * Industry-Level Rate Limiting Middleware
 * Centralized rate limiting logic to eliminate duplication
 */

// Rate limiting configuration
const RATE_LIMIT = 20 // requests per minute
const RATE_WINDOW = 60 * 1000 // 1 minute in milliseconds

// In-memory store for rate limiting (use Redis in production)
const rateLimiter = new Map()

/**
 * Check if user has exceeded rate limit
 * @param {string} userId - User identifier
 * @returns {boolean} - True if within limit, false if exceeded
 */
export function checkRateLimit(userId) {
  const now = Date.now()
  const userRequests = rateLimiter.get(userId) || []
  
  // Filter out requests older than the rate window
  const validRequests = userRequests.filter(timestamp => now - timestamp < RATE_WINDOW)
  
  // Update the rate limiter with valid requests
  rateLimiter.set(userId, validRequests)
  
  // Check if user has exceeded the rate limit
  if (validRequests.length >= RATE_LIMIT) {
    return false // Rate limit exceeded
  }
  
  // Add current request timestamp
  validRequests.push(now)
  rateLimiter.set(userId, validRequests)
  
  return true // Within rate limit
}

/**
 * Express middleware for rate limiting
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Function} next - Express next function
 */
export function rateLimitMiddleware(req, res, next) {
  // Use IP address for unauthenticated requests, user ID for authenticated
  const identifier = req.user?.userId || req.ip || 'anonymous'
  
  if (!checkRateLimit(identifier)) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a moment before trying again.',
      retryAfter: Math.ceil(RATE_WINDOW / 1000) // seconds
    })
  }
  next()
}

/**
 * Get rate limit status for a user
 * @param {string} userId - User identifier
 * @returns {Object} - Rate limit status information
 */
export function getRateLimitStatus(userId) {
  const now = Date.now()
  const userRequests = rateLimiter.get(userId) || []
  const validRequests = userRequests.filter(timestamp => now - timestamp < RATE_WINDOW)
  
  return {
    requestCount: validRequests.length,
    limit: RATE_LIMIT,
    windowMs: RATE_WINDOW,
    remaining: Math.max(0, RATE_LIMIT - validRequests.length),
    resetTime: validRequests.length > 0 ? validRequests[0] + RATE_WINDOW : now
  }
}

/**
 * Clear rate limit for a user (admin function)
 * @param {string} userId - User identifier
 */
export function clearRateLimit(userId) {
  rateLimiter.delete(userId)
}

/**
 * Get all rate limit statistics (admin function)
 * @returns {Object} - Overall rate limiting statistics
 */
export function getRateLimitStats() {
  const now = Date.now()
  let totalUsers = 0
  let activeUsers = 0
  let totalRequests = 0
  
  for (const [userId, requests] of rateLimiter.entries()) {
    totalUsers++
    const validRequests = requests.filter(timestamp => now - timestamp < RATE_WINDOW)
    if (validRequests.length > 0) {
      activeUsers++
      totalRequests += validRequests.length
    }
  }
  
  return {
    totalUsers,
    activeUsers,
    totalRequests,
    rateLimit: RATE_LIMIT,
    windowMs: RATE_WINDOW
  }
}