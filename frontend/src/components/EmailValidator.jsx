/**
 * Email Validator Component
 * Real-time email validation with typo suggestions and domain checking
 */

import React from 'react'
import { 
  getEmailValidationStatus, 
  getEmailValidationColor 
} from '../utils/emailValidation'

const EmailValidator = ({ 
  email, 
  validationResult, 
  onSuggestionClick,
  className = '',
  disabled = false 
}) => {
  if (!email || disabled) {
    return null
  }

  const status = getEmailValidationStatus(validationResult)
  const color = getEmailValidationColor(status)

  if (!validationResult) {
    return null
  }

  return (
    <div className={`email-validator ${className}`}>
      {/* Validation Status */}
      <div className="email-status">
        {validationResult.isValid && (
          <div className="status-item success">
            <span className="status-text">
              Valid email address
              {validationResult.type === 'corporate' && ' (Corporate)'}
              {validationResult.type === 'educational' && ' (Educational)'}
            </span>
          </div>
        )}

        {validationResult.errors.length > 0 && (
          <div className="status-item error">
            <span className="status-text">{validationResult.errors[0]}</span>
          </div>
        )}

        {validationResult.warnings.length > 0 && validationResult.errors.length === 0 && (
          <div className="status-item warning">
            <span className="status-text">{validationResult.warnings[0]}</span>
          </div>
        )}
      </div>


      {/* Email Type Info */}
      {validationResult.isValid && validationResult.type && (
        <div className="email-info">
          <EmailTypeInfo type={validationResult.type} confidence={validationResult.confidence} />
        </div>
      )}
    </div>
  )
}

const EmailTypeInfo = ({ type, confidence }) => {
  const getTypeInfo = () => {
    switch (type) {
      case 'corporate':
        return {
          label: 'Corporate Email',
          description: 'Great for business and professional accounts',
          color: '#10a37f'
        }
      case 'educational':
        return {
          label: 'Educational Email',
          description: 'Academic institution email address',
          color: '#3b82f6'
        }
      case 'personal':
        return {
          label: 'Personal Email',
          description: 'Personal email provider',
          color: '#6b7280'
        }
      default:
        return null
    }
  }

  const typeInfo = getTypeInfo()
  if (!typeInfo) return null

  return (
    <div className="email-type-info">
      <div className="type-details">
        <span className="type-label" style={{ color: typeInfo.color }}>
          {typeInfo.label}
        </span>
        <span className="type-description">{typeInfo.description}</span>
      </div>
    </div>
  )
}

export default EmailValidator