/**
 * Username Availability Checker Component
 * Real-time username validation with suggestions
 */

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const UsernameChecker = ({ 
  username, 
  onAvailabilityChange, 
  onSuggestionClick,
  className = '',
  disabled = false 
}) => {
  const [checkState, setCheckState] = useState('idle') // idle, checking, available, taken, invalid, rate_limited
  const [message, setMessage] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [lastCheckedUsername, setLastCheckedUsername] = useState('')
  const [rateLimitedUntil, setRateLimitedUntil] = useState(null)
  const [countdown, setCountdown] = useState(0)

  // Debounced username checking
  const checkUsername = useCallback(
    debounce(async (usernameToCheck) => {
      try {
        if (!usernameToCheck || usernameToCheck.length < 3) {
          setCheckState('idle')
          setMessage('')
          setSuggestions([])
          setLastCheckedUsername('')
          onAvailabilityChange?.(null)
          return
        }

        // Prevent duplicate checks for the same username
        if (usernameToCheck === lastCheckedUsername) {
          return
        }

        // Check if we're rate limited
        if (rateLimitedUntil && Date.now() < rateLimitedUntil) {
          setCheckState('rate_limited')
          setMessage(`Rate limited. Try again in ${Math.ceil((rateLimitedUntil - Date.now()) / 1000)} seconds`)
          return
        }

        setCheckState('checking')
        setLastCheckedUsername(usernameToCheck)
        
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/check-username/${encodeURIComponent(usernameToCheck)}`,
          {
            timeout: 10000, // 10 second timeout
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        // Clear any previous rate limiting
        setRateLimitedUntil(null)

        if (response.data && response.data.success) {
          const { available, reason, message, suggestions: usernameSuggestions } = response.data.data || {}
          
          if (available) {
            setCheckState('available')
            setMessage('Username is available')
            setSuggestions([])
            onAvailabilityChange?.(true)
          } else {
            if (reason === 'invalid_format') {
              setCheckState('invalid')
            } else {
              setCheckState('taken')
              setSuggestions(usernameSuggestions || [])
            }
            setMessage(message || 'Username is not available')
            onAvailabilityChange?.(false)
          }
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Username check error:', error)
        
        // Handle rate limiting specifically
        if (error.response && error.response.status === 429) {
          setCheckState('rate_limited')
          const waitTime = 60000 // 1 minute
          setRateLimitedUntil(Date.now() + waitTime)
          setCountdown(Math.ceil(waitTime / 1000))
          setMessage(`Rate limited. Wait ${Math.ceil(waitTime / 1000)} seconds`)
          onAvailabilityChange?.(null)
        } else {
          setCheckState('idle')
          setMessage('Unable to check username availability')
          setSuggestions([])
          onAvailabilityChange?.(null)
        }
      }
    }, 1000), // Increased debounce to 1 second to reduce API calls
    [onAvailabilityChange, lastCheckedUsername, rateLimitedUntil]
  )

  // Countdown timer for rate limiting
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
        if (countdown === 1) {
          setRateLimitedUntil(null)
          setCheckState('idle')
          setMessage('')
        } else {
          setMessage(`Rate limited. Wait ${countdown - 1} seconds`)
        }
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [countdown])

  useEffect(() => {
    if (!disabled && username) {
      checkUsername(username)
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      // Cancel any pending debounced calls
      if (checkUsername.cancel) {
        checkUsername.cancel()
      }
    }
  }, [username, checkUsername, disabled])

  if (!username || disabled) {
    return null
  }

  return (
    <div className={`username-checker ${className}`}>
      <div className="username-status">
        {checkState === 'checking' && (
          <div className="status-item checking">
            <span className="status-text">Checking availability...</span>
          </div>
        )}
        
        {checkState === 'available' && (
          <div className="status-item available">
            <span className="status-text">{message}</span>
          </div>
        )}
        
        {checkState === 'taken' && (
          <div className="status-item taken">
            <span className="status-text">{message}</span>
          </div>
        )}
        
        {checkState === 'invalid' && (
          <div className="status-item invalid">
            <span className="status-text">{message}</span>
          </div>
        )}
        
        {checkState === 'rate_limited' && (
          <div className="status-item rate-limited">
            <span className="status-text">{message}</span>
          </div>
        )}
      </div>

    </div>
  )
}

// Debounce utility function with cancellation support
function debounce(func, wait) {
  let timeout
  
  const debouncedFunction = function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      timeout = null
      try {
        func.apply(this, args)
      } catch (error) {
        console.error('Debounced function error:', error)
      }
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
  
  // Add cancel method
  debouncedFunction.cancel = function() {
    clearTimeout(timeout)
    timeout = null
  }
  
  return debouncedFunction
}

export default UsernameChecker