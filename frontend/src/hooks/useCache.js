/**
 * Custom Cache Hook - Industry-level caching with TTL and invalidation
 * Provides intelligent caching for API calls and expensive computations
 */

import { useState, useEffect, useCallback, useRef } from 'react'

// Global cache store
const globalCache = new Map()
const cacheTimestamps = new Map()
const cacheSubscribers = new Map()

// Default cache configuration
const DEFAULT_CONFIG = {
  ttl: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: true,
  maxSize: 100,
  persist: false
}

/**
 * Advanced caching hook with TTL, invalidation, and revalidation
 * @param {string} key - Unique cache key
 * @param {Function} fetcher - Function that returns a Promise
 * @param {Object} config - Cache configuration
 */
export const useCache = (key, fetcher, config = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastFetch, setLastFetch] = useState(null)
  const fetcherRef = useRef(fetcher)
  const mountedRef = useRef(true)

  // Update fetcher ref when it changes
  useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Check if cache is valid
  const isCacheValid = useCallback((cacheKey) => {
    const timestamp = cacheTimestamps.get(cacheKey)
    if (!timestamp) return false
    return Date.now() - timestamp < finalConfig.ttl
  }, [finalConfig.ttl])

  // Get cached data
  const getCachedData = useCallback((cacheKey) => {
    if (globalCache.has(cacheKey) && isCacheValid(cacheKey)) {
      return globalCache.get(cacheKey)
    }
    return null
  }, [isCacheValid])

  // Set cache data
  const setCacheData = useCallback((cacheKey, value) => {
    // Implement LRU eviction if cache is full
    if (globalCache.size >= finalConfig.maxSize) {
      const firstKey = globalCache.keys().next().value
      globalCache.delete(firstKey)
      cacheTimestamps.delete(firstKey)
    }

    globalCache.set(cacheKey, value)
    cacheTimestamps.set(cacheKey, Date.now())

    // Notify all subscribers
    const subscribers = cacheSubscribers.get(cacheKey) || new Set()
    subscribers.forEach(callback => callback(value))

    // Persist to localStorage if enabled
    if (finalConfig.persist) {
      try {
        localStorage.setItem(`cache_${cacheKey}`, JSON.stringify({
          data: value,
          timestamp: Date.now()
        }))
      } catch (e) {
        console.warn('Failed to persist cache to localStorage:', e)
      }
    }
  }, [finalConfig.maxSize, finalConfig.persist])

  // Load from persistent storage
  const loadFromPersistentStorage = useCallback((cacheKey) => {
    if (!finalConfig.persist) return null

    try {
      const stored = localStorage.getItem(`cache_${cacheKey}`)
      if (stored) {
        const { data: storedData, timestamp } = JSON.parse(stored)
        if (Date.now() - timestamp < finalConfig.ttl) {
          return storedData
        }
      }
    } catch (e) {
      console.warn('Failed to load cache from localStorage:', e)
    }
    return null
  }, [finalConfig.persist, finalConfig.ttl])

  // Fetch data with caching logic
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!mountedRef.current) return

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = getCachedData(key)
      if (cached) {
        setData(cached)
        setError(null)
        return cached
      }

      // Try persistent storage
      const persisted = loadFromPersistentStorage(key)
      if (persisted) {
        setData(persisted)
        setError(null)
        // Continue to fetch fresh data in background if staleWhileRevalidate is enabled
        if (!finalConfig.staleWhileRevalidate) {
          return persisted
        }
      }
    }

    setLoading(true)
    setError(null)

    try {
      const result = await fetcherRef.current()
      
      if (!mountedRef.current) return

      setData(result)
      setError(null)
      setLastFetch(Date.now())
      setCacheData(key, result)
      
      return result
    } catch (err) {
      if (!mountedRef.current) return

      setError(err)
      
      // If we have stale data, keep it
      if (finalConfig.staleWhileRevalidate && data) {
        console.warn('Fetch failed, using stale data:', err)
      } else {
        setData(null)
      }
      
      throw err
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [key, getCachedData, loadFromPersistentStorage, setCacheData, finalConfig.staleWhileRevalidate, data])

  // Subscribe to cache updates
  useEffect(() => {
    const subscribers = cacheSubscribers.get(key) || new Set()
    const updateData = (newData) => {
      if (mountedRef.current) {
        setData(newData)
        setError(null)
      }
    }
    
    subscribers.add(updateData)
    cacheSubscribers.set(key, subscribers)

    return () => {
      subscribers.delete(updateData)
      if (subscribers.size === 0) {
        cacheSubscribers.delete(key)
      }
    }
  }, [key])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Invalidate cache
  const invalidate = useCallback(() => {
    globalCache.delete(key)
    cacheTimestamps.delete(key)
    
    if (finalConfig.persist) {
      try {
        localStorage.removeItem(`cache_${key}`)
      } catch (e) {
        console.warn('Failed to remove cache from localStorage:', e)
      }
    }
  }, [key, finalConfig.persist])

  // Refresh data
  const refresh = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  // Check if data is stale
  const isStale = useMemo(() => {
    if (!lastFetch) return true
    return Date.now() - lastFetch > finalConfig.ttl
  }, [lastFetch, finalConfig.ttl])

  return {
    data,
    loading,
    error,
    refresh,
    invalidate,
    isStale,
    lastFetch
  }
}

// Utility functions for cache management
export const clearAllCache = () => {
  globalCache.clear()
  cacheTimestamps.clear()
  
  // Clear localStorage cache
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key)
      }
    })
  } catch (e) {
    console.warn('Failed to clear localStorage cache:', e)
  }
}

export const getCacheStats = () => {
  return {
    size: globalCache.size,
    keys: Array.from(globalCache.keys()),
    timestamps: Object.fromEntries(cacheTimestamps)
  }
}

export default useCache