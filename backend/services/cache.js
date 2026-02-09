/**
 * Redis Cache Service
 * Distributed caching for production scalability
 */

import Redis from 'ioredis'
import { logInfo, logError, logWarn } from './logger.js'

let redisClient = null
let isConnected = false

// Initialize Redis connection
export const initializeCache = () => {
  if (process.env.NODE_ENV === 'test') {
    // Use in-memory cache for tests
    return initializeMemoryCache()
  }

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
  
  try {
    redisClient = new Redis(redisUrl, {
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keyPrefix: 'sara:',
      reconnectOnError: (err) => {
        const targetError = 'READONLY'
        return err.message.includes(targetError)
      }
    })

    redisClient.on('connect', () => {
      logInfo('Redis cache connected')
      isConnected = true
    })

    redisClient.on('error', (error) => {
      logError('Redis cache error', error)
      isConnected = false
    })

    redisClient.on('close', () => {
      logWarn('Redis cache connection closed')
      isConnected = false
    })

    // Test connection
    redisClient.ping().catch((error) => {
      logError('Redis ping failed, falling back to memory cache', error)
      initializeMemoryCache()
    })

  } catch (error) {
    logError('Redis initialization failed, using memory cache', error)
    initializeMemoryCache()
  }
}

// Fallback in-memory cache
const memoryCache = new Map()
const memoryExpiry = new Map()

const initializeMemoryCache = () => {
  logWarn('Using in-memory cache (not suitable for production scaling)')
  isConnected = false
  
  // Clean expired entries every 5 minutes
  setInterval(() => {
    const now = Date.now()
    for (const [key, expiry] of memoryExpiry.entries()) {
      if (expiry < now) {
        memoryCache.delete(key)
        memoryExpiry.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

// Cache operations
export const get = async (key) => {
  try {
    if (isConnected && redisClient) {
      const value = await redisClient.get(key)
      return value ? JSON.parse(value) : null
    } else {
      // Memory cache fallback
      const expiry = memoryExpiry.get(key)
      if (expiry && expiry < Date.now()) {
        memoryCache.delete(key)
        memoryExpiry.delete(key)
        return null
      }
      return memoryCache.get(key) || null
    }
  } catch (error) {
    logError('Cache get error', error, { key })
    return null
  }
}

export const set = async (key, value, ttlSeconds = 3600) => {
  try {
    if (isConnected && redisClient) {
      await redisClient.setex(key, ttlSeconds, JSON.stringify(value))
    } else {
      // Memory cache fallback
      memoryCache.set(key, value)
      memoryExpiry.set(key, Date.now() + (ttlSeconds * 1000))
    }
    return true
  } catch (error) {
    logError('Cache set error', error, { key })
    return false
  }
}

export const del = async (key) => {
  try {
    if (isConnected && redisClient) {
      await redisClient.del(key)
    } else {
      // Memory cache fallback
      memoryCache.delete(key)
      memoryExpiry.delete(key)
    }
    return true
  } catch (error) {
    logError('Cache delete error', error, { key })
    return false
  }
}

export const exists = async (key) => {
  try {
    if (isConnected && redisClient) {
      return await redisClient.exists(key) === 1
    } else {
      // Memory cache fallback
      const expiry = memoryExpiry.get(key)
      if (expiry && expiry < Date.now()) {
        memoryCache.delete(key)
        memoryExpiry.delete(key)
        return false
      }
      return memoryCache.has(key)
    }
  } catch (error) {
    logError('Cache exists error', error, { key })
    return false
  }
}

export const increment = async (key, amount = 1) => {
  try {
    if (isConnected && redisClient) {
      return await redisClient.incrby(key, amount)
    } else {
      // Memory cache fallback
      const current = memoryCache.get(key) || 0
      const newValue = current + amount
      memoryCache.set(key, newValue)
      return newValue
    }
  } catch (error) {
    logError('Cache increment error', error, { key })
    return 0
  }
}

export const expire = async (key, ttlSeconds) => {
  try {
    if (isConnected && redisClient) {
      await redisClient.expire(key, ttlSeconds)
    } else {
      // Memory cache fallback
      memoryExpiry.set(key, Date.now() + (ttlSeconds * 1000))
    }
    return true
  } catch (error) {
    logError('Cache expire error', error, { key })
    return false
  }
}

// High-level cache functions
export const cacheUserProgress = async (userId, progress, ttl = 300) => {
  return await set(`user:progress:${userId}`, progress, ttl)
}

export const getUserProgressFromCache = async (userId) => {
  return await get(`user:progress:${userId}`)
}

export const cacheTopicData = async (topicId, data, ttl = 3600) => {
  return await set(`topic:${topicId}`, data, ttl)
}

export const getTopicDataFromCache = async (topicId) => {
  return await get(`topic:${topicId}`)
}

export const cacheSessionData = async (sessionId, data, ttl = 1800) => {
  return await set(`session:${sessionId}`, data, ttl)
}

export const getSessionDataFromCache = async (sessionId) => {
  return await get(`session:${sessionId}`)
}

// Rate limiting with cache
export const checkRateLimit = async (key, limit, windowSeconds) => {
  try {
    const current = await increment(`ratelimit:${key}`)
    
    if (current === 1) {
      await expire(`ratelimit:${key}`, windowSeconds)
    }
    
    return {
      allowed: current <= limit,
      count: current,
      limit,
      remaining: Math.max(0, limit - current)
    }
  } catch (error) {
    logError('Rate limit check error', error, { key })
    return { allowed: true, count: 0, limit, remaining: limit }
  }
}

export const clearCache = async (pattern = '*') => {
  try {
    if (isConnected && redisClient) {
      const keys = await redisClient.keys(pattern)
      if (keys.length > 0) {
        await redisClient.del(...keys)
      }
    } else {
      // Memory cache fallback
      if (pattern === '*') {
        memoryCache.clear()
        memoryExpiry.clear()
      } else {
        // Simple pattern matching for memory cache
        for (const key of memoryCache.keys()) {
          if (key.includes(pattern.replace('*', ''))) {
            memoryCache.delete(key)
            memoryExpiry.delete(key)
          }
        }
      }
    }
    logInfo('Cache cleared', { pattern })
    return true
  } catch (error) {
    logError('Cache clear error', error, { pattern })
    return false
  }
}

export const getCacheStats = async () => {
  try {
    if (isConnected && redisClient) {
      const info = await redisClient.info('memory')
      return {
        type: 'redis',
        connected: isConnected,
        info: info
      }
    } else {
      return {
        type: 'memory',
        connected: false,
        size: memoryCache.size,
        keys: Array.from(memoryCache.keys())
      }
    }
  } catch (error) {
    logError('Cache stats error', error)
    return { type: 'unknown', connected: false }
  }
}

export default {
  initializeCache,
  get,
  set,
  del,
  exists,
  increment,
  expire,
  cacheUserProgress,
  getUserProgressFromCache,
  cacheTopicData,
  getTopicDataFromCache,
  checkRateLimit,
  clearCache,
  getCacheStats
}