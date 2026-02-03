/**
 * Advanced Email Validation Utilities
 * Professional email validation with domain checking and typo suggestions
 */

// Common email providers for typo suggestions
const COMMON_EMAIL_PROVIDERS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'protonmail.com', 'zoho.com', 'mail.com', 'yandex.com',
  'live.com', 'msn.com', 'comcast.net', 'verizon.net', 'att.net'
]

// Disposable email providers to block
const DISPOSABLE_EMAIL_PROVIDERS = [
  '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
  'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc',
  'sharklasers.com', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me'
]

// Corporate email domains (generally preferred for business accounts)
const CORPORATE_EMAIL_PATTERNS = [
  /\.edu$/i,  // Educational institutions
  /\.gov$/i,  // Government
  /\.org$/i,  // Organizations
  /\.mil$/i   // Military
]

/**
 * Comprehensive email validation
 * @param {string} email - Email to validate
 * @returns {object} Validation result
 */
export function validateEmail(email) {
  const result = {
    isValid: false,
    errors: [],
    warnings: [],
    suggestions: [],
    type: 'unknown', // personal, corporate, educational, disposable
    confidence: 0
  }

  if (!email) {
    result.errors.push('Email address is required')
    return result
  }

  const trimmedEmail = email.trim().toLowerCase()

  // Basic format validation
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!basicEmailRegex.test(trimmedEmail)) {
    result.errors.push('Please enter a valid email address')
    return result
  }

  // Advanced format validation
  const advancedEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  if (!advancedEmailRegex.test(trimmedEmail)) {
    result.errors.push('Email format is not valid')
    return result
  }

  const [localPart, domain] = trimmedEmail.split('@')

  // Local part validation
  if (localPart.length > 64) {
    result.errors.push('Email address is too long')
    return result
  }

  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    result.errors.push('Email format is not valid')
    return result
  }

  // Domain validation
  if (domain.length > 255) {
    result.errors.push('Email domain is too long')
    return result
  }

  // Check for disposable email
  if (DISPOSABLE_EMAIL_PROVIDERS.includes(domain)) {
    result.errors.push('Disposable email addresses are not allowed')
    return result
  }

  // Domain typo detection and suggestions
  const domainSuggestion = suggestDomainCorrection(domain)
  if (domainSuggestion) {
    result.warnings.push(`Did you mean ${localPart}@${domainSuggestion}?`)
    result.suggestions.push(`${localPart}@${domainSuggestion}`)
  }

  // Determine email type
  result.type = determineEmailType(domain)

  // Calculate confidence score
  result.confidence = calculateEmailConfidence(localPart, domain, result.type)

  // Add warnings based on email type
  if (result.type === 'disposable') {
    result.warnings.push('This appears to be a temporary email address')
  } else if (result.type === 'corporate') {
    result.warnings.push('Corporate email detected - great for business accounts!')
  }

  // If no errors, mark as valid
  if (result.errors.length === 0) {
    result.isValid = true
  }

  return result
}

/**
 * Suggest domain corrections for common typos
 */
function suggestDomainCorrection(domain) {
  const commonTypos = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmil.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gmail.cm': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yahoo.co': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'hotmai.com': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'hotmail.co': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outlook.co': 'outlook.com',
    'outloo.com': 'outlook.com'
  }

  // Direct typo match
  if (commonTypos[domain]) {
    return commonTypos[domain]
  }

  // Fuzzy matching for similar domains
  for (const provider of COMMON_EMAIL_PROVIDERS) {
    if (calculateLevenshteinDistance(domain, provider) <= 2 && domain !== provider) {
      return provider
    }
  }

  return null
}

/**
 * Determine email type based on domain
 */
function determineEmailType(domain) {
  if (DISPOSABLE_EMAIL_PROVIDERS.includes(domain)) {
    return 'disposable'
  }

  if (COMMON_EMAIL_PROVIDERS.includes(domain)) {
    return 'personal'
  }

  for (const pattern of CORPORATE_EMAIL_PATTERNS) {
    if (pattern.test(domain)) {
      return 'corporate'
    }
  }

  // If it's not a common provider and not obviously corporate, assume corporate
  if (!domain.includes('mail') && !domain.includes('email')) {
    return 'corporate'
  }

  return 'personal'
}

/**
 * Calculate email confidence score (0-100)
 */
function calculateEmailConfidence(localPart, domain, type) {
  let score = 50 // Base score

  // Local part scoring
  if (localPart.length >= 3 && localPart.length <= 20) score += 15
  if (!/\d{4,}/.test(localPart)) score += 10 // Not just numbers
  if (!/^[a-z]+\d+$/.test(localPart)) score += 10 // Not just name + numbers

  // Domain scoring
  if (COMMON_EMAIL_PROVIDERS.includes(domain)) score += 20
  if (type === 'corporate') score += 15
  if (type === 'educational') score += 10

  // Domain structure
  const domainParts = domain.split('.')
  if (domainParts.length >= 2 && domainParts.length <= 4) score += 10

  return Math.min(100, Math.max(0, score))
}

/**
 * Calculate Levenshtein distance between two strings
 */
function calculateLevenshteinDistance(str1, str2) {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

/**
 * Check if email is likely to be valid (for real-time validation)
 */
export function isEmailLikelyValid(email) {
  if (!email) return false
  
  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!basicRegex.test(email)) return false
  
  const [, domain] = email.toLowerCase().split('@')
  return !DISPOSABLE_EMAIL_PROVIDERS.includes(domain)
}

/**
 * Get email validation status for UI
 */
export function getEmailValidationStatus(validationResult) {
  if (!validationResult) return 'idle'
  
  if (validationResult.errors.length > 0) return 'error'
  if (validationResult.warnings.length > 0) return 'warning'
  if (validationResult.isValid && validationResult.confidence >= 80) return 'success'
  if (validationResult.isValid) return 'warning'
  
  return 'error'
}

/**
 * Get email validation color
 */
export function getEmailValidationColor(status) {
  switch (status) {
    case 'success': return '#10a37f'
    case 'warning': return '#f59e0b'
    case 'error': return '#ef4444'
    default: return '#6b7280'
  }
}