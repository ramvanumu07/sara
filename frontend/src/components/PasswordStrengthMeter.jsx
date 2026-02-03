/**
 * Password Strength Meter Component
 * Simple progress bar with strength label - no separate block
 */

import React from 'react'
import { 
  getPasswordStrengthColor, 
  getPasswordStrengthLabel 
} from '../utils/passwordValidation'

const PasswordStrengthMeter = ({ 
  password, 
  validationResult, 
  className = '' 
}) => {
  if (!password) {
    return null
  }

  const { strength, score } = validationResult
  const strengthColor = getPasswordStrengthColor(strength)
  const strengthLabel = getPasswordStrengthLabel(strength)

  return (
    <div className={`password-strength-inline ${className}`}>
      {/* Simple Progress Bar */}
      <div className="strength-bar-inline">
        <div 
          className="strength-bar-fill-inline"
          style={{ 
            width: `${score}%`,
            backgroundColor: strengthColor,
            transition: 'width 0.3s ease'
          }}
        />
      </div>
      
      {/* Strength Label */}
      <span 
        className="strength-label-inline"
        style={{ color: strengthColor }}
      >
        {strengthLabel}
      </span>
    </div>
  )
}

export default PasswordStrengthMeter