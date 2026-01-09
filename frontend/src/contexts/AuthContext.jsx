import { createContext, useContext, useState, useEffect } from 'react'
import api from '../config/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    checkAuth()
  }, [])
  
  async function checkAuth() {
    const token = localStorage.getItem('devsprout_token')
    if (!token) {
      setLoading(false)
      return
    }
    
    try {
      const res = await api.get('/api/auth/verify')
      if (res.data.success) {
        setUser(res.data.user)
      } else {
        localStorage.removeItem('devsprout_token')
      }
    } catch {
      localStorage.removeItem('devsprout_token')
    }
    setLoading(false)
  }
  
  async function login(studentId, password) {
    const res = await api.post('/api/auth/login', { studentId, password })
    if (res.data.success) {
      localStorage.setItem('devsprout_token', res.data.token)
      setUser(res.data.user)
    }
    return res.data
  }
  
  async function register(studentId, password, name) {
    const res = await api.post('/api/auth/register', { studentId, password, name })
    return res.data
  }
  
  function logout() {
    localStorage.removeItem('devsprout_token')
    setUser(null)
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
