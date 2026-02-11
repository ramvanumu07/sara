/**
 * Error Tracking Service - Industry Grade
 * Centralized error tracking and monitoring with graceful fallbacks
 */

// Graceful import with fallback for missing dependencies
let Sentry = null
let sentryAvailable = false

try {
  const sentryModule = await import('@sentry/node')
  Sentry = sentryModule
  sentryAvailable = true
} catch (error) {
  console.warn('Sentry module not installed. Error tracking will use fallback logging.')
  sentryAvailable = false
}

let isInitialized = false

export const initializeErrorTracking = () => {
  if (isInitialized || process.env.NODE_ENV === 'test') {
    return
  }

  // If Sentry is not available, use fallback logging
  if (!sentryAvailable) {
    console.warn('Sentry not available - using fallback error logging')
    isInitialized = true // Mark as initialized to enable fallback logging
    return
  }

  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    console.warn('SENTRY_DSN not configured - using fallback error logging')
    isInitialized = true // Mark as initialized to enable fallback logging
    return
  }

  try {
    // Build integrations array with version compatibility
    const integrations = []
    
    // Add HTTP integration (available in most versions)
    if (Sentry.httpIntegration) {
      integrations.push(Sentry.httpIntegration({ tracing: true }))
    } else if (Sentry.Integrations && Sentry.Integrations.Http) {
      integrations.push(new Sentry.Integrations.Http({ tracing: true }))
    }

    // Add Express integration with fallback
    if (Sentry.expressIntegration) {
      integrations.push(Sentry.expressIntegration())
    } else if (Sentry.Integrations && Sentry.Integrations.Express) {
      integrations.push(new Sentry.Integrations.Express())
    }

    // Add Postgres integration with fallback
    if (Sentry.postgresIntegration) {
      integrations.push(Sentry.postgresIntegration())
    } else if (Sentry.Integrations && Sentry.Integrations.Postgres) {
      integrations.push(new Sentry.Integrations.Postgres())
    }

    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV || 'development',
      integrations,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend(event, hint) {
        // Filter out non-critical errors in development
        if (process.env.NODE_ENV === 'development') {
          const error = hint.originalException
          if (error && error.message && error.message.includes('ECONNREFUSED')) {
            return null // Don't send connection errors in dev
          }
        }
        return event
      }
    })

    isInitialized = true
    console.log('Sentry error tracking initialized')
  } catch (error) {
    console.warn('Sentry initialization failed - using fallback error logging:', error.message)
    isInitialized = true // Mark as initialized to enable fallback logging
  }
}

export const captureError = (error, context = {}) => {
  if (!isInitialized) {
    console.error('Error (tracking not initialized):', error)
    return
  }

  // Fallback logging if Sentry is not available
  if (!sentryAvailable) {
    console.error('🚨 ERROR CAPTURED:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })
    return
  }

  try {
    Sentry.withScope((scope) => {
      // Add context information
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value)
      })

      // Add tags for filtering
      scope.setTag('component', context.component || 'unknown')
      scope.setTag('operation', context.operation || 'unknown')

      // Capture the error
      Sentry.captureException(error)
    })
  } catch (sentryError) {
    // Fallback to console logging if Sentry fails
    console.error('🚨 ERROR CAPTURED (Sentry failed):', {
      originalError: error.message,
      sentryError: sentryError.message,
      context,
      timestamp: new Date().toISOString()
    })
  }
}

export const captureMessage = (message, level = 'info', context = {}) => {
  if (!isInitialized) {
    console.log(`${level.toUpperCase()}: ${message}`)
    return
  }

  // Fallback logging if Sentry is not available
  if (!sentryAvailable) {
    console.log(`📝 ${level.toUpperCase()}: ${message}`, context)
    return
  }

  try {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value)
      })

      Sentry.captureMessage(message, level)
    })
  } catch (sentryError) {
    console.log(`📝 ${level.toUpperCase()} (Sentry failed): ${message}`, context)
  }
}

export const addBreadcrumb = (message, category = 'custom', level = 'info', data = {}) => {
  if (!isInitialized) return

  if (!sentryAvailable) {
    console.log(`🍞 BREADCRUMB [${category}]: ${message}`, data)
    return
  }

  try {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data
    })
  } catch (error) {
    console.log(`🍞 BREADCRUMB [${category}]: ${message}`, data)
  }
}

export const setUserContext = (user) => {
  if (!isInitialized) return

  if (!sentryAvailable) {
    console.log('👤 USER CONTEXT SET:', { id: user.id, username: user.username })
    return
  }

  try {
    Sentry.setUser({
      id: user.id,
      username: user.username,
      email: user.email
    })
  } catch (error) {
    console.log('👤 USER CONTEXT SET (fallback):', { id: user.id, username: user.username })
  }
}

export const clearUserContext = () => {
  if (!isInitialized) return

  if (!sentryAvailable) {
    console.log('👤 USER CONTEXT CLEARED')
    return
  }

  try {
    Sentry.setUser(null)
  } catch (error) {
    console.log('👤 USER CONTEXT CLEARED (fallback)')
  }
}

// Express middleware with graceful fallbacks
export const sentryRequestHandler = () => {
  if (!isInitialized || !sentryAvailable) {
    return (req, res, next) => next()
  }
  
  try {
    return Sentry.requestHandler()
  } catch (error) {
    console.warn('Sentry request handler failed, using passthrough')
    return (req, res, next) => next()
  }
}

export const sentryTracingHandler = () => {
  if (!isInitialized || !sentryAvailable) {
    return (req, res, next) => next()
  }
  
  try {
    return Sentry.tracingHandler()
  } catch (error) {
    console.warn('Sentry tracing handler failed, using passthrough')
    return (req, res, next) => next()
  }
}

export const sentryErrorHandler = () => {
  if (!isInitialized || !sentryAvailable) {
    return (error, req, res, next) => {
      // Fallback error logging
      console.error('🚨 EXPRESS ERROR:', {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
      })
      next(error)
    }
  }
  
  try {
    return Sentry.errorHandler()
  } catch (sentryError) {
    console.warn('Sentry error handler failed, using fallback')
    return (error, req, res, next) => {
      console.error('🚨 EXPRESS ERROR (Sentry failed):', {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        sentryError: sentryError.message,
        timestamp: new Date().toISOString()
      })
      next(error)
    }
  }
}

export default {
  initializeErrorTracking,
  captureError,
  captureMessage,
  addBreadcrumb,
  setUserContext,
  clearUserContext,
  sentryRequestHandler,
  sentryTracingHandler,
  sentryErrorHandler
}