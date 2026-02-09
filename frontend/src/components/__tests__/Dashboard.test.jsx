/**
 * Dashboard Component Tests
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import Dashboard from '../../pages/Dashboard'

// Mock API calls
jest.mock('../../config/api', () => ({
  learning: {
    getCourses: jest.fn(() => Promise.resolve({
      data: { success: true, data: { courses: [] } }
    })),
    getContinueLearning: jest.fn(() => Promise.resolve({
      data: { success: true, data: { lastAccessed: null } }
    }))
  },
  progress: {
    getAll: jest.fn(() => Promise.resolve({
      data: { success: true, data: { progress: [] } }
    }))
  }
}))

const renderDashboard = (user = null) => {
  const mockAuthContext = {
    user: user || { id: '1', name: 'Test User', username: 'testuser' },
    isAuthenticated: true,
    logout: jest.fn()
  }

  return render(
    <BrowserRouter>
      <AuthProvider value={mockAuthContext}>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Dashboard Component', () => {
  test('renders dashboard for authenticated user', async () => {
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
    })
  })
  
  test('displays user name', async () => {
    const user = { id: '1', name: 'John Doe', username: 'johndoe' }
    renderDashboard(user)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })
  
  test('shows loading state initially', () => {
    renderDashboard()
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
  
  test('displays continue learning section', async () => {
    renderDashboard()
    
    await waitFor(() => {
      expect(screen.getByText(/continue learning/i)).toBeInTheDocument()
    })
  })
})