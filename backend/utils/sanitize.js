// Sanitize string input to prevent XSS and limit length
export function sanitizeString(input, maxLength = 1000) {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Remove potential XSS characters and limit length
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
    .trim()
    .substring(0, maxLength)
}

// Sanitize code input (more permissive for programming content)
export function sanitizeCode(input, maxLength = 10000) {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Only limit length for code, preserve programming characters
  return input.trim().substring(0, maxLength)
}