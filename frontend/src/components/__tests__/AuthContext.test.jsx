/**
 * AuthContext Tests
 */

import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'

// Mock API
jest.mock('../../config/api', () => ({
  auth: {
    login: jest.fn(),
    validate: jest.fn()
  },
  getToken: jest.fn(),
  getUser: jest.fn(),
  setToken: jest.fn(),
  setUser: jest.fn(),
  removeToken: jest.fn(),
  removeUser: jest.fn()
}))

const wrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthContext', () => {
  test('provides authentication state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.isAuthenticated).toBeDefined()
    expect(result.current.user).toBeDefined()
    expect(result.current.login).toBeDefined()
    expect(result.current.logout).toBeDefined()
  })
  
  test('starts with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
  })
  
  test('login function updates state on success', async () => {
    const mockAuth = require('../../config/api').auth
    mockAuth.login.mockResolvedValue({
      data: {
        success: true,
        data: {
          user: { id: '1', name: 'Test User' },
          accessToken: 'test-token',
          refreshToken: 'refresh-token'
        }
      }
    })
    
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      const loginResult = await result.current.login('test@example.com', 'password')
      expect(loginResult.success).toBe(true)
    })
    
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual({ id: '1', name: 'Test User' })
  })
  
  test('logout function clears state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    // First login
    await act(async () => {
      result.current.setUserState({ id: '1', name: 'Test User' })
      result.current.setIsAuthenticated(true)
    })
    
    // Then logout
    await act(async () => {
      await result.current.logout()
    })
    
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
  })
})