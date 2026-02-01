/**
 * Industry-Level Validation Middleware
 * Centralized validation logic with comprehensive error handling
 */

import { createValidationErrorResponse } from '../utils/responses.js'

/**
 * Validation schemas for different endpoints
 */
export const schemas = {
  sessionStart: {
    topicId: { type: 'string', required: true, minLength: 1 },
    topicTitle: { type: 'string', required: false },
    assignments: { type: 'array', required: false }
  },

  codeExecution: {
    code: { type: 'string', required: true, minLength: 1 },
    topicId: { type: 'string', required: false }
  },

  chatMessage: {
    message: { type: 'string', required: true, minLength: 1, maxLength: 2000 },
    topicId: { type: 'string', required: true, minLength: 1 }
  },

  userRegistration: {
    studentId: { type: 'string', required: true, minLength: 3, maxLength: 50 },
    password: { type: 'string', required: true, minLength: 6, maxLength: 100 },
    name: { type: 'string', required: true, minLength: 1, maxLength: 100 }
  },

  userLogin: {
    studentId: { type: 'string', required: true, minLength: 1 },
    password: { type: 'string', required: true, minLength: 1 }
  }
}

/**
 * Validate a single field against its schema
 * @param {any} value - Value to validate
 * @param {Object} fieldSchema - Schema for the field
 * @param {string} fieldName - Name of the field
 * @returns {Array} - Array of error messages (empty if valid)
 */
function validateField(value, fieldSchema, fieldName) {
  const errors = []

  // Check if required field is missing
  if (fieldSchema.required && (value === undefined || value === null || value === '')) {
    errors.push(`${fieldName} is required`)
    return errors // Don't continue validation if required field is missing
  }

  // Skip further validation if field is optional and not provided
  if (!fieldSchema.required && (value === undefined || value === null)) {
    return errors
  }

  // Type validation
  if (fieldSchema.type) {
    const actualType = Array.isArray(value) ? 'array' : typeof value
    if (actualType !== fieldSchema.type) {
      errors.push(`${fieldName} must be of type ${fieldSchema.type}`)
      return errors // Don't continue if type is wrong
    }
  }

  // String validations
  if (fieldSchema.type === 'string' && typeof value === 'string') {
    if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
      errors.push(`${fieldName} must be at least ${fieldSchema.minLength} characters long`)
    }
    if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
      errors.push(`${fieldName} must be at most ${fieldSchema.maxLength} characters long`)
    }
    if (fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
      errors.push(`${fieldName} format is invalid`)
    }
  }

  // Number validations
  if (fieldSchema.type === 'number' && typeof value === 'number') {
    if (fieldSchema.min !== undefined && value < fieldSchema.min) {
      errors.push(`${fieldName} must be at least ${fieldSchema.min}`)
    }
    if (fieldSchema.max !== undefined && value > fieldSchema.max) {
      errors.push(`${fieldName} must be at most ${fieldSchema.max}`)
    }
  }

  // Array validations
  if (fieldSchema.type === 'array' && Array.isArray(value)) {
    if (fieldSchema.minItems && value.length < fieldSchema.minItems) {
      errors.push(`${fieldName} must have at least ${fieldSchema.minItems} items`)
    }
    if (fieldSchema.maxItems && value.length > fieldSchema.maxItems) {
      errors.push(`${fieldName} must have at most ${fieldSchema.maxItems} items`)
    }
  }

  return errors
}

/**
 * Validate request body against a schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export function validateData(data, schema) {
  const errors = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Request body must be a valid object'] }
  }

  // Validate each field in the schema
  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const fieldErrors = validateField(data[fieldName], fieldSchema, fieldName)
    errors.push(...fieldErrors)
  }

  // Check for unexpected fields (optional strict mode)
  const allowedFields = Object.keys(schema)
  const providedFields = Object.keys(data)
  const unexpectedFields = providedFields.filter(field => !allowedFields.includes(field))

  if (unexpectedFields.length > 0) {
    errors.push(`Unexpected fields: ${unexpectedFields.join(', ')}`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Express middleware factory for request body validation
 * @param {Object} schema - Validation schema to use
 * @returns {Function} - Express middleware function
 */
export function validateBody(schema) {
  return (req, res, next) => {
    const validation = validateData(req.body, schema)

    if (!validation.valid) {
      return res.status(400).json(createValidationErrorResponse(validation.errors))
    }

    next()
  }
}

/**
 * Express middleware factory for query parameter validation
 * @param {Object} schema - Validation schema to use
 * @returns {Function} - Express middleware function
 */
export function validateQuery(schema) {
  return (req, res, next) => {
    const validation = validateData(req.query, schema)

    if (!validation.valid) {
      return res.status(400).json(createValidationErrorResponse(validation.errors))
    }

    next()
  }
}

/**
 * Express middleware factory for route parameter validation
 * @param {Object} schema - Validation schema to use
 * @returns {Function} - Express middleware function
 */
export function validateParams(schema) {
  return (req, res, next) => {
    const validation = validateData(req.params, schema)

    if (!validation.valid) {
      return res.status(400).json(createValidationErrorResponse(validation.errors))
    }

    next()
  }
}

/**
 * Sanitize string input by trimming and removing dangerous characters
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') {
    return input
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML/XML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

/**
 * Sanitize object by applying string sanitization to all string values
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  const sanitized = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Express middleware for input sanitization
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export function sanitizeInput(req, res, next) {
  if (req.body) {
    req.body = sanitizeObject(req.body)
  }
  if (req.query) {
    req.query = sanitizeObject(req.query)
  }
  if (req.params) {
    req.params = sanitizeObject(req.params)
  }

  next()
}