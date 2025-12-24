import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Payment from './pages/Payment'
import { API_URL } from './config/api'

// Loading spinner component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  )
}

// Protected route - requires authentication
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingScreen />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Subscription required route - requires active subscription
function SubscriptionRoute({ children }) {
  const { user, loading, hasActiveSubscription } = useAuth()
  
  if (loading) {
    return <LoadingScreen />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (!hasActiveSubscription()) {
    return <Navigate to="/subscribe" replace />
  }
  
  return children
}

function AppRoutes() {
  const { user, hasActiveSubscription } = useAuth()
  
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      
      {/* Payment route */}
      <Route 
        path="/subscribe" 
        element={
          <ProtectedRoute>
            {hasActiveSubscription() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Payment />
            )}
          </ProtectedRoute>
        } 
      />
      
      {/* Dashboard - shows subscription prompt if not subscribed */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Chat/Learning - requires subscription */}
      <Route 
        path="/learn/:topicId/:subtopicId" 
        element={
          <SubscriptionRoute>
            <Chat />
          </SubscriptionRoute>
        } 
      />
      
      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  // Pre-warm the backend on app load (helps with Render cold starts)
  useEffect(() => {
    fetch(`${API_URL}/health`).catch(() => {})
  }, [])

  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
