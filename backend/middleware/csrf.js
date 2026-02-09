/**
 * CSRF Protection Middleware
 * Protects against Cross-Site Request Forgery attacks
 */

import crypto from 'crypto'

// Store CSRF tokens (in production, use Redis)
const csrfTokens = new Map()

export const generateCSRFToken = (req, res, next) => {
  const token = crypto.randomBytes(32).toString('hex')
  const userId = req.user?.userId || req.ip
  
  // Store token with expiration (1 hour)
  csrfTokens.set(userId, {
    token,
    expires: Date.now() + 60 * 60 * 1000
  })
  
  // Clean expired tokens
  cleanExpiredTokens()
  
  req.csrfToken = token
  res.locals.csrfToken = token
  
  next()
}

export const validateCSRFToken = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next()
  }
  
  const userId = req.user?.userId || req.ip
  const clientToken = req.headers['x-csrf-token'] || req.body._csrf
  
  if (!clientToken) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token missing'
    })
  }
  
  const storedTokenData = csrfTokens.get(userId)
  
  if (!storedTokenData || storedTokenData.expires < Date.now()) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token expired'
    })
  }
  
  if (storedTokenData.token !== clientToken) {
    return res.status(403).json({
      success: false,
      error: 'Invalid CSRF token'
    })
  }
  
  next()
}

function cleanExpiredTokens() {
  const now = Date.now()
  for (const [userId, tokenData] of csrfTokens.entries()) {
    if (tokenData.expires < now) {
      csrfTokens.delete(userId)
    }
  }
}

export default { generateCSRFToken, validateCSRFToken }