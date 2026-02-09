/**
 * Authentication Tests
 * Tests for auth routes and JWT functionality
 */

import request from 'supertest'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import app from '../server.js'
import { createTestUser, testClient } from './setup.js'

describe('Authentication System', () => {
  describe('POST /api/auth/signup', () => {
    test('should create new user with valid data', async () => {
      const userData = await createTestUser()
      
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: userData.username,
          email: userData.email,
          name: userData.name,
          password: userData.password,
          confirmPassword: userData.password
        })
      
      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user.username).toBe(userData.username)
      expect(response.body.data.accessToken).toBeDefined()
      expect(response.body.data.refreshToken).toBeDefined()
    })
    
    test('should reject invalid email', async () => {
      const userData = await createTestUser({ email: 'invalid-email' })
      
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: userData.username,
          email: userData.email,
          name: userData.name,
          password: userData.password,
          confirmPassword: userData.password
        })
      
      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
    
    test('should reject weak password', async () => {
      const userData = await createTestUser({ password: '123' })
      
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: userData.username,
          email: userData.email,
          name: userData.name,
          password: userData.password,
          confirmPassword: userData.password
        })
      
      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })
  
  describe('POST /api/auth/login', () => {
    let testUser
    
    beforeEach(async () => {
      // Create test user in database
      testUser = await createTestUser()
      const hashedPassword = await bcrypt.hash(testUser.password, 12)
      
      const { data } = await testClient
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
      
      testUser.id = data.id
    })
    
    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          usernameOrEmail: testUser.username,
          password: testUser.password
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.user.username).toBe(testUser.username)
      expect(response.body.data.accessToken).toBeDefined()
      expect(response.body.data.refreshToken).toBeDefined()
    })
    
    test('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          usernameOrEmail: testUser.username,
          password: 'wrongpassword'
        })
      
      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
    
    test('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          usernameOrEmail: 'nonexistent@example.com',
          password: 'password123'
        })
      
      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
  
  describe('POST /api/auth/refresh', () => {
    let testUser, refreshToken
    
    beforeEach(async () => {
      // Create user and login to get refresh token
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
      
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          usernameOrEmail: testUser.username,
          password: testUser.password
        })
      
      refreshToken = loginResponse.body.data.refreshToken
    })
    
    test('should refresh tokens with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.accessToken).toBeDefined()
      expect(response.body.data.refreshToken).toBeDefined()
    })
    
    test('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
      
      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
    })
  })
  
  describe('JWT Token Validation', () => {
    test('should validate properly formatted JWT', () => {
      const payload = { userId: '123', username: 'test' }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      expect(decoded.userId).toBe('123')
      expect(decoded.username).toBe('test')
    })
    
    test('should reject expired JWT', () => {
      const payload = { userId: '123', username: 'test' }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '-1h' })
      
      expect(() => {
        jwt.verify(token, process.env.JWT_SECRET)
      }).toThrow()
    })
  })
})