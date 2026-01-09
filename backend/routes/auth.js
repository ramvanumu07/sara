import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createUser, getUserByStudentId, updateUserAccess, getAllUsers, isAdmin } from '../services/supabase.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'devsprout-secret-2024'

// Middleware to verify JWT
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token required' })
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' })
    req.user = user
    next()
  })
}

// Middleware to check admin
export async function requireAdmin(req, res, next) {
  const admin = await isAdmin(req.user.userId)
  if (!admin) {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  next()
}

// ============ REGISTER ============
router.post('/register', async (req, res) => {
  try {
    const { studentId, password, name } = req.body
    
    if (!studentId || !password || !name) {
      return res.status(400).json({ success: false, message: 'Student ID, password, and name are required' })
    }
    
    // Check if user exists
    const existing = await getUserByStudentId(studentId)
    if (existing) {
      return res.status(400).json({ success: false, message: 'Student ID already exists' })
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await createUser(studentId, hashedPassword, name)
    
    // Generate token
    const token = jwt.sign({ userId: user.id, studentId: user.student_id }, JWT_SECRET, { expiresIn: '7d' })
    
    res.json({
      success: true,
      message: 'Registration successful! Wait for admin to grant access.',
      token,
      user: { id: user.id, studentId: user.student_id, name: user.name, hasAccess: user.has_access }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ success: false, message: 'Registration failed' })
  }
})

// ============ LOGIN ============
router.post('/login', async (req, res) => {
  try {
    const { studentId, password } = req.body
    
    if (!studentId || !password) {
      return res.status(400).json({ success: false, message: 'Student ID and password are required' })
    }
    
    // Find user
    const user = await getUserByStudentId(studentId)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
    
    // Check access
    if (!user.has_access) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access not granted yet. Please contact admin after payment.',
        needsAccess: true
      })
    }
    
    // Check expiry
    if (user.access_expires_at && new Date(user.access_expires_at) < new Date()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Your access has expired. Please renew.',
        expired: true
      })
    }
    
    // Generate token
    const token = jwt.sign({ userId: user.id, studentId: user.student_id }, JWT_SECRET, { expiresIn: '7d' })
    
    res.json({
      success: true,
      token,
      user: { 
        id: user.id, 
        studentId: user.student_id, 
        name: user.name, 
        hasAccess: user.has_access,
        expiresAt: user.access_expires_at
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Login failed' })
  }
})

// ============ ADMIN: GRANT ACCESS ============
router.post('/admin/grant-access', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { studentId, durationDays } = req.body
    
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID required' })
    }
    
    const expiresAt = durationDays 
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
      : null
    
    const user = await updateUserAccess(studentId, true, expiresAt)
    
    res.json({ success: true, message: `Access granted to ${studentId}`, user })
  } catch (error) {
    console.error('Grant access error:', error)
    res.status(500).json({ success: false, message: 'Failed to grant access' })
  }
})

// ============ ADMIN: REVOKE ACCESS ============
router.post('/admin/revoke-access', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { studentId } = req.body
    
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID required' })
    }
    
    const user = await updateUserAccess(studentId, false, null)
    
    res.json({ success: true, message: `Access revoked for ${studentId}`, user })
  } catch (error) {
    console.error('Revoke access error:', error)
    res.status(500).json({ success: false, message: 'Failed to revoke access' })
  }
})

// ============ ADMIN: LIST USERS ============
router.get('/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await getAllUsers()
    res.json({ success: true, users })
  } catch (error) {
    console.error('List users error:', error)
    res.status(500).json({ success: false, message: 'Failed to list users' })
  }
})

// ============ VERIFY TOKEN ============
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await getUserByStudentId(req.user.studentId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        studentId: user.student_id,
        name: user.name,
        hasAccess: user.has_access,
        expiresAt: user.access_expires_at
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Verification failed' })
  }
})

export default router
