/**
 * Distributed Rate Limiting Middleware
 * Uses Redis for rate limiting across multiple server instances
 */

import { checkRateLimit } from '../services/cache.js'
import { logSecurityEvent } from '../services/logger.js'
import { createErrorResponse } from '../utils/responses.js'

// Rate limiting configurations
const RATE_LIMITS = {
  auth: { limit: 5, window: 900 }, // 5 requests per 15 minutes
  api: { limit: 100, window: 60 }, // 100 requests per minute
  execute: { limit: 30, window: 60 }, // 30 code executions per minute
  strict: { limit: 10, window: 60 } // 10 requests per minute for sensitive endpoints
}

export const createRateLimiter = (type = 'api', keyGenerator = null) => {
  const config = RATE_LIMITS[type] || RATE_LIMITS.api
  
  return async (req, res, next) => {
    try {
      // Generate rate limit key
      let key
      if (keyGenerator) {
        key = keyGenerator(req)
      } else {
        // Default: use IP + user ID if available
        const userId = req.user?.userId || 'anonymous'
        const ip = req.ip || req.connection.remoteAddress
        key = `${type}:${userId}:${ip}`
      }
      
      // Check rate limit
      const result = await checkRateLimit(key, config.limit, config.window)
      
      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': config.limit,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': new Date(Date.now() + (config.window * 1000)).toISOString()
      })
      
      if (!result.allowed) {
        // Log security event
        logSecurityEvent('Rate limit exceeded', {
          type,
          key,
          count: result.count,
          limit: config.limit,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          userId: req.user?.userId
        })
        
        return res.status(429).json(createErrorResponse(
          'Rate limit exceeded. Please try again later.',
          {
            retryAfter: config.window,
            limit: config.limit,
            remaining: 0
          }
        ))
      }
      
      next()
    } catch (error) {
      // If rate limiting fails, allow the request but log the error
      logError('Rate limiting error', error, {
        type,
        url: req.originalUrl,
        method: req.method
      })
      next()
    }
  }
}

// Specific rate limiters
export const authRateLimit = createRateLimiter('auth', (req) => {
  // Rate limit by IP for auth endpoints
  return `auth:${req.ip}`
})

export const apiRateLimit = createRateLimiter('api', (req) => {
  // Rate limit by user ID + IP for API endpoints
  const userId = req.user?.userId || 'anonymous'
  return `api:${userId}:${req.ip}`
})

export const executeRateLimit = createRateLimiter('execute', (req) => {
  // Rate limit code execution by user ID
  const userId = req.user?.userId || req.ip
  return `execute:${userId}`
})

export const strictRateLimit = createRateLimiter('strict', (req) => {
  // Strict rate limiting for sensitive endpoints
  const userId = req.user?.userId || 'anonymous'
  return `strict:${userId}:${req.ip}`
})

// IP-based rate limiting (for unauthenticated endpoints)
export const ipRateLimit = createRateLimiter('api', (req) => {
  return `ip:${req.ip}`
})

// User-based rate limiting (for authenticated endpoints)
export const userRateLimit = createRateLimiter('api', (req) => {
  const userId = req.user?.userId
  if (!userId) {
    throw new Error('User rate limit requires authentication')
  }
  return `user:${userId}`
})

// Progressive rate limiting (stricter for repeated violations)
export const progressiveRateLimit = (baseType = 'api') => {
  return async (req, res, next) => {
    try {
      const baseConfig = RATE_LIMITS[baseType] || RATE_LIMITS.api
      const userId = req.user?.userId || 'anonymous'
      const ip = req.ip
      const key = `${baseType}:${userId}:${ip}`
      
      // Check for violations in the last hour
      const violationKey = `violations:${key}`
      const violations = await checkRateLimit(violationKey, 10, 3600) // Track violations for 1 hour
      
      // Adjust limits based on violation history
      let adjustedLimit = baseConfig.limit
      if (violations.count > 3) {
        adjustedLimit = Math.max(1, Math.floor(baseConfig.limit / 2)) // Halve the limit
      } else if (violations.count > 1) {
        adjustedLimit = Math.floor(baseConfig.limit * 0.75) // Reduce by 25%
      }
      
      // Check rate limit with adjusted limit
      const result = await checkRateLimit(key, adjustedLimit, baseConfig.window)
      
      // Add headers
      res.set({
        'X-RateLimit-Limit': adjustedLimit,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': new Date(Date.now() + (baseConfig.window * 1000)).toISOString(),
        'X-RateLimit-Violations': violations.count
      })
      
      if (!result.allowed) {
        // Record violation
        await checkRateLimit(violationKey, 10, 3600)
        
        logSecurityEvent('Progressive rate limit exceeded', {
          type: baseType,
          key,
          violations: violations.count,
          adjustedLimit,
          originalLimit: baseConfig.limit
        })
        
        return res.status(429).json(createErrorResponse(
          'Rate limit exceeded. Continued violations may result in stricter limits.',
          {
            retryAfter: baseConfig.window,
            limit: adjustedLimit,
            violations: violations.count
          }
        ))
      }
      
      next()
    } catch (error) {
      logError('Progressive rate limiting error', error)
      next()
    }
  }
}

export default {
  createRateLimiter,
  authRateLimit,
  apiRateLimit,
  executeRateLimit,
  strictRateLimit,
  ipRateLimit,
  userRateLimit,
  progressiveRateLimit
}