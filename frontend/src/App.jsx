/**
 * App Component - Sara Learning Platform
 * Main application routing and layout with Sara branding
 * Enhanced with proper authentication-based redirects
 */

import React from 'react'
import { createPortal } from 'react-dom'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Import Pages
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Learn from './pages/Learn'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

// Import Styles
import './index.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

// Separate component to access auth context
const AppRoutes = () => {
  const { loading } = useAuth()

  // Show loading while checking authentication
  if (loading) {
    const loadingOverlayStyle = {
      position: 'fixed',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
      background: 'rgba(255,255,255,0.98)',
      zIndex: 99999
    }
    return createPortal(
      <div className="app-loading" style={loadingOverlayStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div
            className="loading-spinner"
            style={{
              width: 32,
              height: 32,
              border: '3px solid #e5e7eb',
              borderTopColor: '#10a37f',
              borderRadius: '50%',
              animation: 'loadingSpin 1s linear infinite',
              flexShrink: 0
            }}
            aria-hidden
          />
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>Loading Sara...</p>
        </div>
      </div>,
      document.body
    )
  }

  return (
    <Routes>
      {/* Public Routes with Authentication Guards */}
      <Route path="/" element={<PublicRoute><Welcome /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      
      {/* Legal Pages - Always accessible */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/learn/:topicId" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
      
      {/* Legacy Route Redirects */}
      <Route path="/learn/:topicId/:subtopicId" element={<LegacyRedirect />} />
      
      {/* Catch All - Smart Redirect */}
      <Route path="*" element={<SmartRedirect />} />
    </Routes>
  )
}

// Public Route Guard - Redirects authenticated users to dashboard
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Protected Route Guard - Redirects unauthenticated users to login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Smart Redirect - Routes unknown paths based on auth status
const SmartRedirect = () => {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  } else {
    return <Navigate to="/" replace />
  }
}

// Legacy Route Redirect Component (for backward compatibility)
const LegacyRedirect = () => {
  const { topicId } = useParams()
  return <Navigate to={`/learn/${topicId}`} replace />
}

export default App