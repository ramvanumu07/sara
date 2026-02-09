/**
 * Learning API Tests
 * Tests for learning routes and functionality
 */

import request from 'supertest'
import bcrypt from 'bcrypt'
import app from '../server.js'
import { createTestUser, testClient } from './setup.js'

describe('Learning API', () => {
  let testUser, authToken
  
  beforeEach(async () => {
    // Create and authenticate test user
    testUser = await createTestUser()
    const hashedPassword = await bcrypt.hash(testUser.password, 12)
    
    const { data: userData } = await testClient
      .from('users')
      .insert({
        username: testUser.username,
        email: testUser.email,
        name: testUser.name,
        password: hashedPassword,
        has_access: true
      })
      .select()
      .single()
    
    testUser.id = userData.id
    
    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        usernameOrEmail: testUser.username,
        password: testUser.password
      })
    
    authToken = loginResponse.body.data.accessToken
  })
  
  describe('GET /api/learn/courses', () => {
    test('should return courses for authenticated user', async () => {
      const response = await request(app)
        .get('/api/learn/courses')
        .set('Authorization', `Bearer ${authToken}`)
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data.courses)).toBe(true)
    })
    
    test('should reject unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/learn/courses')
      
      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
  
  describe('GET /api/learn/continue', () => {
    test('should return continue learning data', async () => {
      const response = await request(app)
        .get('/api/learn/continue')
        .set('Authorization', `Bearer ${authToken}`)
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.lastAccessed).toBeDefined()
    })
  })
  
  describe('GET /api/learn/progress', () => {
    test('should return user progress', async () => {
      const response = await request(app)
        .get('/api/learn/progress')
        .set('Authorization', `Bearer ${authToken}`)
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data.progress)).toBe(true)
    })
  })
  
  describe('POST /api/learn/session/start', () => {
    test('should start learning session', async () => {
      const response = await request(app)
        .post('/api/learn/session/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          topicId: 'foundation'
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })
    
    test('should reject invalid topic ID', async () => {
      const response = await request(app)
        .post('/api/learn/session/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          topicId: 'invalid-topic'
        })
      
      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
    })
  })
  
  describe('POST /api/learn/execute', () => {
    test('should execute valid JavaScript code', async () => {
      const response = await request(app)
        .post('/api/learn/execute')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          code: 'console.log("Hello, World!");',
          topicId: 'foundation'
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.output).toContain('Hello, World!')
    })
    
    test('should handle code execution errors', async () => {
      const response = await request(app)
        .post('/api/learn/execute')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          code: 'throw new Error("Test error");',
          topicId: 'foundation'
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.output).toContain('Error: Test error')
    })
    
    test('should prevent infinite loops', async () => {
      const response = await request(app)
        .post('/api/learn/execute')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          code: 'while(true) { console.log("infinite"); }',
          topicId: 'foundation'
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      // Should timeout and not hang
    }, 10000) // 10 second timeout for this test
  })
})