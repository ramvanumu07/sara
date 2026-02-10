/**
 * Industry-Level Response Utilities
 * Centralized response formatting to eliminate duplication and ensure consistency
 */

/**
 * Create a standardized success response
 * @param {any} data - Response data
 * @param {string} message - Optional success message
 * @param {Object} meta - Optional metadata
 * @returns {Object} - Standardized success response
 */
export function createSuccessResponse(data, message = null, meta = null) {
  const response = {
    success: true,
    timestamp: new Date().toISOString()
  }

  if (message) {
    response.message = message
  }

  if (data !== null && data !== undefined) {
    response.data = data
  }

  if (meta) {
    response.meta = meta
  }

  return response
}

/**
 * Create a standardized error response
 * @param {string} message - Error message
 * @param {string} code - Optional error code
 * @param {any} details - Optional error details
 * @returns {Object} - Standardized error response
 */
export function createErrorResponse(message, code = null, details = null) {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  }

  if (code) {
    response.code = code
  }

  if (details) {
    response.details = details
  }

  return response
}

/**
 * Create a validation error response
 * @param {Array} errors - Array of validation errors
 * @param {string} message - Optional custom message
 * @returns {Object} - Standardized validation error response
 */
export function createValidationErrorResponse(errors, message = 'Validation failed') {
  return createErrorResponse(message, 'VALIDATION_ERROR', {
    errors: Array.isArray(errors) ? errors : [errors]
  })
}

/**
 * Create a rate limit error response
 * @param {number} retryAfter - Seconds to wait before retrying
 * @returns {Object} - Standardized rate limit error response
 */
export function createRateLimitErrorResponse(retryAfter = 60) {
  return createErrorResponse(
    'Too many requests. Please wait a moment before trying again.',
    'RATE_LIMIT_EXCEEDED',
    { retryAfter }
  )
}

/**
 * Create an authentication error response
 * @param {string} message - Optional custom message
 * @returns {Object} - Standardized authentication error response
 */
export function createAuthErrorResponse(message = 'Authentication required') {
  return createErrorResponse(message, 'AUTH_ERROR')
}

/**
 * Create an authorization error response
 * @param {string} message - Optional custom message
 * @returns {Object} - Standardized authorization error response
 */
export function createAuthorizationErrorResponse(message = 'Insufficient permissions') {
  return createErrorResponse(message, 'AUTHORIZATION_ERROR')
}

/**
 * Create a not found error response
 * @param {string} resource - Resource that was not found
 * @returns {Object} - Standardized not found error response
 */
export function createNotFoundErrorResponse(resource = 'Resource') {
  return createErrorResponse(`${resource} not found`, 'NOT_FOUND')
}

/**
 * Create a server error response
 * @param {string} message - Optional custom message
 * @param {any} details - Optional error details (only in development)
 * @returns {Object} - Standardized server error response
 */
export function createServerErrorResponse(message = 'Internal server error', details = null) {
  const response = createErrorResponse(message, 'SERVER_ERROR')

  // Only include details in development environment
  if (process.env.NODE_ENV === 'development' && details) {
    response.details = details
  }

  return response
}

/**
 * Send a standardized error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {string} code - Optional error code
 * @param {any} details - Optional error details
 */
export function sendErrorResponse(res, message, statusCode = 500, code = null, details = null) {
  res.status(statusCode).json(createErrorResponse(message, code, details))
}

/**
 * Handle and send error response based on error type
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} operation - Operation that failed
 * @param {number} defaultStatusCode - Default status code if not determined
 */
export function handleErrorResponse(res, error, operation = 'operation', defaultStatusCode = 500) {
  console.error(`${operation} error:`, error)

  // Determine status code based on error type
  let statusCode = defaultStatusCode
  let message = `Failed to process ${operation}`
  let code = 'SERVER_ERROR'

  if (error.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation failed'
    code = 'VALIDATION_ERROR'
  } else if (error.name === 'UnauthorizedError' || error.message.includes('token')) {
    statusCode = 401
    message = 'Authentication required'
    code = 'AUTH_ERROR'
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403
    message = 'Insufficient permissions'
    code = 'AUTHORIZATION_ERROR'
  } else if (error.name === 'NotFoundError') {
    statusCode = 404
    message = 'Resource not found'
    code = 'NOT_FOUND'
  } else if (error.message) {
    message = error.message
  }

  sendErrorResponse(res, message, statusCode, code,
    process.env.NODE_ENV === 'development' ? error.stack : null)
}