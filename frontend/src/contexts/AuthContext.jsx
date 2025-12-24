import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../config/api'

const AuthContext = createContext(null)

// Token management
const TOKEN_KEY = 'devsprout_token'
const USER_KEY = 'devsprout_user'

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Set up axios interceptor for auth token
  useEffect(() => {
    const token = getStoredToken()
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    // Response interceptor for handling 401/403 errors
    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Token expired or invalid
          if (error.response?.data?.code !== 'SUBSCRIPTION_REQUIRED') {
            clearStoredAuth()
            setUser(null)
            delete api.defaults.headers.common['Authorization']
          }
        }
        return Promise.reject(error)
      }
    )

    return () => api.interceptors.response.eject(interceptor)
  }, [])

  // Load user from localStorage and verify token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken()
      const savedUser = localStorage.getItem(USER_KEY)

      if (token && savedUser) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // Verify token is still valid and get fresh user data
          const response = await api.get('/api/auth/me')
          
          if (response.data.success) {
            const userData = response.data.user
            setUser(userData)
            localStorage.setItem(USER_KEY, JSON.stringify(userData))
          } else {
            clearStoredAuth()
          }
        } catch (e) {
          console.log('Token verification failed:', e.message)
          clearStoredAuth()
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  // Register new user
  const register = async (email, name) => {
    try {
      setError(null)
      const response = await api.post('/api/auth/register', { email, name })
      
      if (response.data.success) {
        const { user: userData, token } = response.data
        
        setStoredToken(token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        setUser(userData)
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
        
        return { success: true }
      } else {
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      setError(message)
      return { success: false, error: message }
    }
  }

  // Login with email
  const login = async (email) => {
    try {
      setError(null)
      const response = await api.post('/api/auth/login', { email })
      
      if (response.data.success) {
        const { user: userData, token } = response.data
        
        setStoredToken(token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        setUser(userData)
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
        
        return { success: true }
      } else {
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      setError(message)
      return { success: false, error: message }
    }
  }

  // Logout
  const logout = useCallback(() => {
    clearStoredAuth()
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setError(null)
  }, [])

  // Refresh user data from server
  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/me')
      if (response.data.success) {
        const userData = response.data.user
        setUser(userData)
        localStorage.setItem(USER_KEY, JSON.stringify(userData))
        return userData
      }
    } catch (error) {
      console.log('User refresh failed:', error.message)
    }
    return null
  }, [])

  // Update user subscription status (called after payment)
  const updateSubscription = useCallback((subscriptionData) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = {
        ...prev,
        hasSubscription: true,
        subscription: subscriptionData
      }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Check if user has active subscription
  const hasActiveSubscription = useCallback(() => {
    if (!user) return false
    if (!user.hasSubscription) return false
    if (!user.subscription) return false
    
    const expiresAt = new Date(user.subscription.expiresAt)
    return expiresAt > new Date()
  }, [user])

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      error,
      register,
      login, 
      logout,
      refreshUser,
      updateSubscription,
      hasActiveSubscription,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
