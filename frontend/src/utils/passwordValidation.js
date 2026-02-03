/**
 * Password Validation Utilities - Industry Standard
 * Comprehensive password security validation with strength scoring
 */

// Common weak passwords to reject
const COMMON_PASSWORDS = [
  'password', 'password123', '123456', '123456789', 'qwerty', 'abc123',
  'password1', 'admin', 'letmein', 'welcome', 'monkey', '1234567890',
  'dragon', 'master', 'shadow', 'superman', 'michael', 'football',
  'baseball', 'liverpool', 'jordan', 'harley', 'robert', 'thomas',
  'hunter', 'daniel', 'andrew', 'michelle', 'jessica', 'matthew'
]

// Password strength levels
export const PASSWORD_STRENGTH = {
  VERY_WEAK: 0,
  WEAK: 1,
  FAIR: 2,
  GOOD: 3,
  STRONG: 4,
  VERY_STRONG: 5
}

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  noCommonPasswords: true
}

/**
 * Validate password against security requirements
 * @param {string} password - Password to validate
 * @returns {object} Validation result with errors and strength
 */
export function validatePassword(password) {
  const errors = []
  const warnings = []
  const requirements = {
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    specialChars: false,
    noCommon: false
  }

  // Check if password exists
  if (!password) {
    return {
      isValid: false,
      strength: PASSWORD_STRENGTH.VERY_WEAK,
      score: 0,
      errors: ['Password is required'],
      warnings: [],
      requirements,
      feedback: 'Please enter a password'
    }
  }

  // Length validation
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`)
  } else if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    errors.push(`Password must be no more than ${PASSWORD_REQUIREMENTS.maxLength} characters long`)
  } else {
    requirements.length = true
  }

  // Character type requirements
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else if (PASSWORD_REQUIREMENTS.requireUppercase) {
    requirements.uppercase = true
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else if (PASSWORD_REQUIREMENTS.requireLowercase) {
    requirements.lowercase = true
  }

  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  } else if (PASSWORD_REQUIREMENTS.requireNumbers) {
    requirements.numbers = true
  }

  if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)')
  } else if (PASSWORD_REQUIREMENTS.requireSpecialChars) {
    requirements.specialChars = true
  }

  // Common password check
  const lowerPassword = password.toLowerCase()
  if (COMMON_PASSWORDS.includes(lowerPassword)) {
    errors.push('This password is too common. Please choose a more unique password')
  } else {
    requirements.noCommon = true
  }

  // Calculate strength score
  const strengthResult = calculatePasswordStrength(password, requirements)

  // Generate feedback
  const feedback = generatePasswordFeedback(strengthResult.strength, errors, warnings)

  return {
    isValid: errors.length === 0,
    strength: strengthResult.strength,
    score: strengthResult.score,
    errors,
    warnings,
    requirements,
    feedback
  }
}


/**
 * Calculate password strength score
 */
function calculatePasswordStrength(password, requirements) {
  let score = 0
  let strength = PASSWORD_STRENGTH.VERY_WEAK

  // Base score from requirements
  const metRequirements = Object.values(requirements).filter(Boolean).length
  score += metRequirements * 10

  // Length bonus
  if (password.length >= 12) score += 15
  else if (password.length >= 10) score += 10
  else if (password.length >= 8) score += 5

  // Character variety bonus
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)
  
  const varietyCount = [hasUpper, hasLower, hasNumbers, hasSpecial].filter(Boolean).length
  score += varietyCount * 5

  // Pattern penalties
  if (/(.)\1{2,}/.test(password)) score -= 10 // Repeated characters
  if (/123|abc|qwe|asd|zxc/i.test(password)) score -= 15 // Sequential patterns
  if (/^\d+$/.test(password)) score -= 20 // All numbers
  if (/^[a-zA-Z]+$/.test(password)) score -= 15 // All letters

  // Determine strength level
  if (score >= 80) strength = PASSWORD_STRENGTH.VERY_STRONG
  else if (score >= 65) strength = PASSWORD_STRENGTH.STRONG
  else if (score >= 50) strength = PASSWORD_STRENGTH.GOOD
  else if (score >= 35) strength = PASSWORD_STRENGTH.FAIR
  else if (score >= 20) strength = PASSWORD_STRENGTH.WEAK
  else strength = PASSWORD_STRENGTH.VERY_WEAK

  return { score: Math.min(100, Math.max(0, score)), strength }
}

/**
 * Generate user-friendly feedback
 */
function generatePasswordFeedback(strength, errors, warnings) {
  if (errors.length > 0) {
    return errors[0] // Show first error
  }

  switch (strength) {
    case PASSWORD_STRENGTH.VERY_STRONG:
      return 'Excellent! Your password is very strong'
    case PASSWORD_STRENGTH.STRONG:
      return 'Great! Your password is strong'
    case PASSWORD_STRENGTH.GOOD:
      return 'Good password strength'
    case PASSWORD_STRENGTH.FAIR:
      return 'Fair password. Consider making it stronger'
    case PASSWORD_STRENGTH.WEAK:
      return 'Weak password. Please make it stronger'
    default:
      return 'Very weak password. Please choose a stronger password'
  }
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(strength) {
  switch (strength) {
    case PASSWORD_STRENGTH.VERY_STRONG:
      return '#10a37f' // Green
    case PASSWORD_STRENGTH.STRONG:
      return '#22c55e' // Light green
    case PASSWORD_STRENGTH.GOOD:
      return '#eab308' // Yellow
    case PASSWORD_STRENGTH.FAIR:
      return '#f97316' // Orange
    case PASSWORD_STRENGTH.WEAK:
      return '#ef4444' // Red
    default:
      return '#dc2626' // Dark red
  }
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(strength) {
  switch (strength) {
    case PASSWORD_STRENGTH.VERY_STRONG:
      return 'Very Strong'
    case PASSWORD_STRENGTH.STRONG:
      return 'Strong'
    case PASSWORD_STRENGTH.GOOD:
      return 'Good'
    case PASSWORD_STRENGTH.FAIR:
      return 'Fair'
    case PASSWORD_STRENGTH.WEAK:
      return 'Weak'
    default:
      return 'Very Weak'
  }
}