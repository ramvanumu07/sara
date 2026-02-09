/**
 * Test Setup Configuration
 * Sets up test environment and utilities
 */

import dotenv from 'dotenv'
import { initializeDatabase } from '../services/database.js'

// Load test environment variables
dotenv.config({ path: '.env.test' })

// Test database setup
let testClient

beforeAll(async () => {
  // Initialize test database connection
  testClient = initializeDatabase()
  
  // Clean test database
  await cleanTestDatabase()
})

afterAll(async () => {
  // Clean up after tests
  await cleanTestDatabase()
})

beforeEach(async () => {
  // Reset database state before each test
  await cleanTestDatabase()
})

async function cleanTestDatabase() {
  if (!testClient) return
  
  try {
    // Delete test data in correct order (foreign keys)
    await testClient.from('user_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await testClient.from('user_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await testClient.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  } catch (error) {
    console.warn('Database cleanup warning:', error.message)
  }
}

// Test utilities
export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    name: 'Test User',
    password: 'TestPassword123!',
    has_access: true
  }
  
  return { ...defaultUser, ...overrides }
}

export const createTestSession = async (userId, overrides = {}) => {
  const defaultSession = {
    user_id: userId,
    token: `test_token_${Date.now()}`,
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    refresh_token: `test_refresh_${Date.now()}`,
    refresh_expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString()
  }
  
  return { ...defaultSession, ...overrides }
}

export { testClient }