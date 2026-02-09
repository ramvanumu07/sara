/**
 * Error Tracking Service
 * Centralized error tracking and monitoring
 */

import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

let isInitialized = false

export const initializeErrorTracking = () => {
  if (isInitialized || process.env.NODE_ENV === 'test') {
    return
  }

  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    console.warn('⚠️  SENTRY_DSN not configured - error tracking disabled')
    return
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      nodeProfilingIntegration(),
      Sentry.httpIntegration({ tracing: true }),
      Sentry.expressIntegration(),
      Sentry.postgresIntegration()
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
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
  console.log('✅ Error tracking initialized')
}

export const captureError = (error, context = {}) => {
  if (!isInitialized) {
    console.error('Error (tracking not initialized):', error)
    return
  }

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
}

export const captureMessage = (message, level = 'info', context = {}) => {
  if (!isInitialized) {
    console.log(`${level.toUpperCase()}: ${message}`)
    return
  }

  Sentry.withScope((scope) => {
    Object.entries(context).forEach(([key, value]) => {
      scope.setContext(key, value)
    })
    
    Sentry.captureMessage(message, level)
  })
}

export const addBreadcrumb = (message, category = 'custom', level = 'info', data = {}) => {
  if (!isInitialized) return

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data
  })
}

export const setUserContext = (user) => {
  if (!isInitialized) return

  Sentry.setUser({
    id: user.id,
    username: user.username,
    email: user.email
  })
}

export const clearUserContext = () => {
  if (!isInitialized) return
  
  Sentry.setUser(null)
}

// Express middleware
export const sentryRequestHandler = () => {
  if (!isInitialized) {
    return (req, res, next) => next()
  }
  return Sentry.requestHandler()
}

export const sentryTracingHandler = () => {
  if (!isInitialized) {
    return (req, res, next) => next()
  }
  return Sentry.tracingHandler()
}

export const sentryErrorHandler = () => {
  if (!isInitialized) {
    return (error, req, res, next) => next(error)
  }
  return Sentry.errorHandler()
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