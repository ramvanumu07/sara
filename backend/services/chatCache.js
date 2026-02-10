/**
 * Chat History Caching Service
 * Implements intelligent caching for chat history to improve performance
 */

import { initializeCache } from './cache.js'

// Initialize cache service
const cache = initializeCache()

// Cache configuration
const CACHE_CONFIG = {
  CHAT_HISTORY_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_SIZE: 1000, // Maximum number of cached entries
  CACHE_KEY_PREFIX: 'chat_history:'
}

/**
 * Generate cache key for chat history
 */
function getCacheKey(userId, topicId) {
  return `${CACHE_CONFIG.CACHE_KEY_PREFIX}${userId}:${topicId}`
}

/**
 * Get chat history from cache
 */
export async function getCachedChatHistory(userId, topicId) {
  try {
    const cacheKey = getCacheKey(userId, topicId)
    const cachedData = await cache.get(cacheKey)
    
    if (cachedData) {
      // Parse cached data
      const data = JSON.parse(cachedData)
      
      // Check if cache is still valid
      const now = Date.now()
      if (now - data.timestamp < CACHE_CONFIG.CHAT_HISTORY_TTL) {
        return data.messages
      }
      
      // Cache expired, remove it
      await cache.del(cacheKey)
    }
    
    return null
  } catch (error) {
    console.warn('Cache read error:', error.message)
    return null
  }
}

/**
 * Cache chat history
 */
export async function setCachedChatHistory(userId, topicId, messages) {
  try {
    const cacheKey = getCacheKey(userId, topicId)
    const cacheData = {
      messages,
      timestamp: Date.now(),
      messageCount: messages.length
    }
    
    // Set cache with TTL
    await cache.setex(cacheKey, Math.floor(CACHE_CONFIG.CHAT_HISTORY_TTL / 1000), JSON.stringify(cacheData))
    
  } catch (error) {
    console.warn('Cache write error:', error.message)
  }
}

/**
 * Invalidate chat history cache for a specific user/topic
 */
export async function invalidateChatHistoryCache(userId, topicId) {
  try {
    const cacheKey = getCacheKey(userId, topicId)
    await cache.del(cacheKey)
  } catch (error) {
    console.warn('Cache invalidation error:', error.message)
  }
}

/**
 * Clear all chat history cache for a user
 */
export async function clearUserChatCache(userId) {
  try {
    const pattern = `${CACHE_CONFIG.CACHE_KEY_PREFIX}${userId}:*`
    const keys = await cache.keys(pattern)
    
    if (keys.length > 0) {
      await cache.del(...keys)
    }
  } catch (error) {
    console.warn('User cache clear error:', error.message)
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  try {
    const pattern = `${CACHE_CONFIG.CACHE_KEY_PREFIX}*`
    const keys = await cache.keys(pattern)
    
    return {
      totalEntries: keys.length,
      maxSize: CACHE_CONFIG.MAX_CACHE_SIZE,
      ttlMinutes: CACHE_CONFIG.CHAT_HISTORY_TTL / (60 * 1000),
      cacheHitRate: 'Not implemented' // Could be added with metrics
    }
  } catch (error) {
    console.warn('Cache stats error:', error.message)
    return {
      totalEntries: 0,
      maxSize: CACHE_CONFIG.MAX_CACHE_SIZE,
      ttlMinutes: CACHE_CONFIG.CHAT_HISTORY_TTL / (60 * 1000),
      error: error.message
    }
  }
}

export default {
  getCachedChatHistory,
  setCachedChatHistory,
  invalidateChatHistoryCache,
  clearUserChatCache,
  getCacheStats
}