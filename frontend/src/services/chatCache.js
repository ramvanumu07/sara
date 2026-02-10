/**
 * Frontend Chat Caching Service
 * Reduces redundant API calls and improves performance
 */

// In-memory cache for chat history
const chatCache = new Map()

// Cache configuration
const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 50 // Maximum number of cached topics
}

/**
 * Generate cache key
 */
function getCacheKey(topicId) {
  return `chat_history_${topicId}`
}

/**
 * Get cached chat history
 */
export function getCachedChatHistory(topicId) {
  const cacheKey = getCacheKey(topicId)
  const cached = chatCache.get(cacheKey)
  
  if (!cached) {
    return null
  }
  
  // Check if cache is still valid
  const now = Date.now()
  if (now - cached.timestamp > CACHE_CONFIG.TTL) {
    chatCache.delete(cacheKey)
    return null
  }
  
  return cached.data
}

/**
 * Set cached chat history
 */
export function setCachedChatHistory(topicId, data) {
  const cacheKey = getCacheKey(topicId)
  
  // Implement LRU eviction if cache is full
  if (chatCache.size >= CACHE_CONFIG.MAX_SIZE) {
    const firstKey = chatCache.keys().next().value
    chatCache.delete(firstKey)
  }
  
  chatCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  })
}

/**
 * Invalidate cache for a topic
 */
export function invalidateChatCache(topicId) {
  const cacheKey = getCacheKey(topicId)
  chatCache.delete(cacheKey)
}

/**
 * Clear all cache
 */
export function clearChatCache() {
  chatCache.clear()
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const now = Date.now()
  let validEntries = 0
  let expiredEntries = 0
  
  for (const [key, value] of chatCache.entries()) {
    if (now - value.timestamp <= CACHE_CONFIG.TTL) {
      validEntries++
    } else {
      expiredEntries++
    }
  }
  
  return {
    totalEntries: chatCache.size,
    validEntries,
    expiredEntries,
    maxSize: CACHE_CONFIG.MAX_SIZE,
    ttlMinutes: CACHE_CONFIG.TTL / (60 * 1000)
  }
}

export default {
  getCachedChatHistory,
  setCachedChatHistory,
  invalidateChatCache,
  clearChatCache,
  getCacheStats
}