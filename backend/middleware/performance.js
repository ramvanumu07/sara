/**
 * Performance Monitoring Middleware - Industry Level
 * Professional performance tracking and optimization
 */

// ============ PERFORMANCE MONITORING ============

export const performanceMonitor = (req, res, next) => {
  const startTime = process.hrtime.bigint()
  const timestamp = new Date().toISOString()
  
  // Log request start
  console.log(`[${timestamp}] 🚀 ${req.method} ${req.path} - Started`)
  
  // Override res.json to capture response time
  const originalJson = res.json
  res.json = function(data) {
    const endTime = process.hrtime.bigint()
    const duration = Number(endTime - startTime) / 1000000 // Convert to milliseconds
    
    const logTimestamp = new Date().toISOString()
    
    if (duration > 1000) {
      console.warn(`[${logTimestamp}] 🐌 SLOW REQUEST: ${req.method} ${req.path} - ${duration.toFixed(2)}ms`)
    } else if (duration > 500) {
      console.log(`[${logTimestamp}] ⚠️  ${req.method} ${req.path} - ${duration.toFixed(2)}ms`)
    } else {
      console.log(`[${logTimestamp}] ✅ ${req.method} ${req.path} - ${duration.toFixed(2)}ms`)
    }
    
    // Add performance headers
    res.set('X-Response-Time', `${duration.toFixed(2)}ms`)
    res.set('X-Timestamp', logTimestamp)
    
    return originalJson.call(this, data)
  }
  
  next()
}

// ============ DATABASE PERFORMANCE UTILITIES ============

export const withPerformanceLogging = async (operation, operationName) => {
  const startTime = process.hrtime.bigint()
  const timestamp = new Date().toISOString()
  
  try {
    console.log(`[${timestamp}] 🔍 DB Operation: ${operationName} - Started`)
    
    const result = await operation()
    
    const endTime = process.hrtime.bigint()
    const duration = Number(endTime - startTime) / 1000000
    
    const logTimestamp = new Date().toISOString()
    
    if (duration > 2000) {
      console.error(`[${logTimestamp}] 🚨 CRITICAL DB SLOW: ${operationName} - ${duration.toFixed(2)}ms`)
    } else if (duration > 500) {
      console.warn(`[${logTimestamp}] 🐌 DB SLOW: ${operationName} - ${duration.toFixed(2)}ms`)
    } else {
      console.log(`[${logTimestamp}] ✅ DB: ${operationName} - ${duration.toFixed(2)}ms`)
    }
    
    return result
    
  } catch (error) {
    const endTime = process.hrtime.bigint()
    const duration = Number(endTime - startTime) / 1000000
    const logTimestamp = new Date().toISOString()
    
    console.error(`[${logTimestamp}] ❌ DB ERROR: ${operationName} - ${duration.toFixed(2)}ms - ${error.message}`)
    throw error
  }
}

// ============ PERFORMANCE OPTIMIZATION UTILITIES ============

export const createCache = (ttlMs = 60000) => {
  const cache = new Map()
  
  return {
    get: (key) => {
      const item = cache.get(key)
      if (!item) return null
      
      if (Date.now() > item.expires) {
        cache.delete(key)
        return null
      }
      
      return item.value
    },
    
    set: (key, value) => {
      cache.set(key, {
        value,
        expires: Date.now() + ttlMs
      })
    },
    
    delete: (key) => {
      return cache.delete(key)
    },
    
    clear: () => cache.clear(),
    size: () => cache.size
  }
}

// Cache for frequently accessed data
export const progressCache = createCache(30000) // 30 second TTL
// REMOVED: chatHistoryCache - causes reliability issues, use direct database access