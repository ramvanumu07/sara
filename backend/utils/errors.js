// Standardized error codes for API responses

export const ErrorCodes = {
  // Auth errors (1xxx)
  AUTH_TOKEN_REQUIRED: { code: 'AUTH_TOKEN_REQUIRED', status: 401, message: 'Authentication token required' },
  AUTH_TOKEN_INVALID: { code: 'AUTH_TOKEN_INVALID', status: 403, message: 'Invalid or expired token' },
  AUTH_INVALID_CREDENTIALS: { code: 'AUTH_INVALID_CREDENTIALS', status: 401, message: 'Invalid credentials' },
  AUTH_ACCESS_DENIED: { code: 'AUTH_ACCESS_DENIED', status: 403, message: 'Access not granted. Please contact admin.' },
  AUTH_ACCESS_EXPIRED: { code: 'AUTH_ACCESS_EXPIRED', status: 403, message: 'Your access has expired. Please renew.' },
  AUTH_ADMIN_REQUIRED: { code: 'AUTH_ADMIN_REQUIRED', status: 403, message: 'Admin access required' },
  AUTH_USER_EXISTS: { code: 'AUTH_USER_EXISTS', status: 400, message: 'User already exists' },
  AUTH_USER_NOT_FOUND: { code: 'AUTH_USER_NOT_FOUND', status: 404, message: 'User not found' },
  
  // Validation errors (2xxx)
  VALIDATION_REQUIRED_FIELD: { code: 'VALIDATION_REQUIRED_FIELD', status: 400, message: 'Required field missing' },
  VALIDATION_INVALID_INPUT: { code: 'VALIDATION_INVALID_INPUT', status: 400, message: 'Invalid input' },
  
  // Rate limiting (3xxx)
  RATE_LIMIT_EXCEEDED: { code: 'RATE_LIMIT_EXCEEDED', status: 429, message: 'Too many requests. Please wait.' },
  
  // Resource errors (4xxx)
  RESOURCE_NOT_FOUND: { code: 'RESOURCE_NOT_FOUND', status: 404, message: 'Resource not found' },
  
  // Server errors (5xxx)
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500, message: 'Internal server error' },
  AI_SERVICE_ERROR: { code: 'AI_SERVICE_ERROR', status: 503, message: 'AI service temporarily unavailable' },
  DATABASE_ERROR: { code: 'DATABASE_ERROR', status: 503, message: 'Database error' }
}

/**
 * Send standardized error response
 * @param {Response} res - Express response object
 * @param {Object} errorDef - Error definition from ErrorCodes
 * @param {string} [customMessage] - Override default message
 * @param {Object} [data] - Additional error data
 */
export function sendError(res, errorDef, customMessage = null, data = {}) {
  return res.status(errorDef.status).json({
    success: false,
    error: {
      code: errorDef.code,
      message: customMessage || errorDef.message,
      ...data
    }
  })
}

/**
 * Send standardized success response
 * @param {Response} res - Express response object  
 * @param {Object} data - Response data
 * @param {number} [status=200] - HTTP status code
 */
export function sendSuccess(res, data = {}, status = 200) {
  return res.status(status).json({
    success: true,
    ...data
  })
}
