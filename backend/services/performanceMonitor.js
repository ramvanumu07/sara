/**
 * Custom Performance Monitoring Service
 * Industry-grade performance tracking without native dependencies
 */

import { logInfo, logWarn, logError } from './logger.js'

// Performance metrics storage
const metrics = {
  requests: new Map(),
  database: new Map(),
  cache: new Map(),
  api: new Map()
}

// Performance thresholds (milliseconds)
const THRESHOLDS = {
  request: {
    fast: 100,
    slow: 1000,
    critical: 5000
  },
  database: {
    fast: 50,
    slow: 500,
    critical: 2000
  },
  cache: {
    fast: 10,
    slow: 100,
    critical: 500
  }
}

export class PerformanceTimer {
  constructor(operation, category = 'general') {
    this.operation = operation
    this.category = category
    this.startTime = process.hrtime.bigint()
    this.metadata = {}
  }

  addMetadata(key, value) {
    this.metadata[key] = value
    return this
  }

  end() {
    const endTime = process.hrtime.bigint()
    const duration = Number(endTime - this.startTime) / 1000000 // Convert to milliseconds
    
    this.recordMetric(duration)
    this.logPerformance(duration)
    
    return duration
  }

  recordMetric(duration) {
    const key = `${this.category}:${this.operation}`
    const existing = metrics[this.category]?.get(key) || {
      count: 0,
      totalTime: 0,
      minTime: Infinity,
      maxTime: 0,
      recentTimes: []
    }

    existing.count++
    existing.totalTime += duration
    existing.minTime = Math.min(existing.minTime, duration)
    existing.maxTime = Math.max(existing.maxTime, duration)
    existing.recentTimes.push(duration)
    
    // Keep only last 100 measurements
    if (existing.recentTimes.length > 100) {
      existing.recentTimes.shift()
    }

    if (!metrics[this.category]) {
      metrics[this.category] = new Map()
    }
    metrics[this.category].set(key, existing)
  }

  logPerformance(duration) {
    const threshold = THRESHOLDS[this.category] || THRESHOLDS.request
    let level = 'info'
    let status = 'fast'

    if (duration > threshold.critical) {
      level = 'error'
      status = 'critical'
    } else if (duration > threshold.slow) {
      level = 'warn'
      status = 'slow'
    }

    const logData = {
      operation: this.operation,
      category: this.category,
      duration: `${duration.toFixed(2)}ms`,
      status,
      ...this.metadata
    }

    if (level === 'error') {
      logError(`Critical performance: ${this.operation}`, null, logData)
    } else if (level === 'warn') {
      logWarn(`Slow performance: ${this.operation}`, logData)
    } else {
      logInfo(`Performance: ${this.operation}`, logData)
    }
  }
}

// Helper functions for common operations
export const trackRequest = (method, path) => {
  return new PerformanceTimer(`${method} ${path}`, 'requests')
}

export const trackDatabase = (operation, table = 'unknown') => {
  return new PerformanceTimer(operation, 'database').addMetadata('table', table)
}

export const trackCache = (operation, key = 'unknown') => {
  return new PerformanceTimer(operation, 'cache').addMetadata('key', key)
}

export const trackAPI = (service, endpoint) => {
  return new PerformanceTimer(`${service}:${endpoint}`, 'api')
}

// Get performance statistics
export const getPerformanceStats = () => {
  const stats = {}
  
  for (const [category, categoryMetrics] of Object.entries(metrics)) {
    stats[category] = {}
    
    for (const [key, data] of categoryMetrics) {
      const avgTime = data.totalTime / data.count
      const recentAvg = data.recentTimes.length > 0 
        ? data.recentTimes.reduce((a, b) => a + b, 0) / data.recentTimes.length 
        : 0

      stats[category][key] = {
        count: data.count,
        averageTime: Math.round(avgTime * 100) / 100,
        recentAverageTime: Math.round(recentAvg * 100) / 100,
        minTime: Math.round(data.minTime * 100) / 100,
        maxTime: Math.round(data.maxTime * 100) / 100,
        totalTime: Math.round(data.totalTime * 100) / 100
      }
    }
  }
  
  return stats
}

// Clear old metrics (run periodically)
export const cleanupMetrics = () => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000)
  
  for (const categoryMetrics of Object.values(metrics)) {
    for (const [key, data] of categoryMetrics) {
      // Keep only recent measurements
      data.recentTimes = data.recentTimes.slice(-50)
    }
  }
  
  logInfo('Performance metrics cleaned up')
}

// Middleware for Express request tracking
export const performanceMiddleware = (req, res, next) => {
  const timer = trackRequest(req.method, req.route?.path || req.path)
  timer.addMetadata('ip', req.ip)
  timer.addMetadata('userAgent', req.get('User-Agent'))
  
  if (req.user) {
    timer.addMetadata('userId', req.user.userId)
  }

  res.on('finish', () => {
    timer.addMetadata('statusCode', res.statusCode)
    timer.end()
  })

  next()
}

// Performance alerts
export const checkPerformanceAlerts = () => {
  const stats = getPerformanceStats()
  const alerts = []

  for (const [category, categoryStats] of Object.entries(stats)) {
    const threshold = THRESHOLDS[category] || THRESHOLDS.request

    for (const [operation, operationStats] of Object.entries(categoryStats)) {
      if (operationStats.recentAverageTime > threshold.slow) {
        alerts.push({
          category,
          operation,
          averageTime: operationStats.recentAverageTime,
          threshold: threshold.slow,
          severity: operationStats.recentAverageTime > threshold.critical ? 'critical' : 'warning'
        })
      }
    }
  }

  if (alerts.length > 0) {
    logWarn('Performance alerts detected', { alerts })
  }

  return alerts
}

// Initialize periodic cleanup
setInterval(cleanupMetrics, 60 * 60 * 1000) // Every hour
setInterval(checkPerformanceAlerts, 5 * 60 * 1000) // Every 5 minutes

export default {
  PerformanceTimer,
  trackRequest,
  trackDatabase,
  trackCache,
  trackAPI,
  getPerformanceStats,
  performanceMiddleware,
  checkPerformanceAlerts
}