import express from 'express'
import jwt from 'jsonwebtoken'
import { 
  getUserByEmail, 
  createUser, 
  getUserById,
  checkSubscriptionActive,
  getSubscription,
  isAdmin
} from '../services/supabase.js'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'devsprout-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

/**
 * Generate JWT token for user
 */
function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

/**
 * Verify JWT token middleware
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' })
  }
}

/**
 * Check if user has active subscription
 */
export async function requireSubscription(req, res, next) {
  try {
    const hasSubscription = await checkSubscriptionActive(req.user.userId)
    if (!hasSubscription) {
      return res.status(403).json({ 
        success: false, 
        message: 'Active subscription required',
        code: 'SUBSCRIPTION_REQUIRED'
      })
    }
    next()
  } catch (error) {
    console.error('Subscription check error:', error)
    res.status(500).json({ success: false, message: 'Failed to verify subscription' })
  }
}

/**
 * Check if user is admin
 */
export async function requireAdmin(req, res, next) {
  try {
    const adminStatus = await isAdmin(req.user.userId)
    if (!adminStatus) {
      return res.status(403).json({ success: false, message: 'Admin access required' })
    }
    next()
  } catch (error) {
    console.error('Admin check error:', error)
    res.status(500).json({ success: false, message: 'Failed to verify admin status' })
  }
}

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, name } = req.body

    if (!email || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and name are required' 
      })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      })
    }

    // Create new user
    const user = await createUser(email.toLowerCase(), name)
    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasSubscription: false
      },
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ success: false, message: 'Registration failed' })
  }
})

/**
 * POST /api/auth/login
 * Login with email (passwordless - for MVP)
 */
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      })
    }

    // Find user
    const user = await getUserByEmail(email.toLowerCase())
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found. Please register first.' 
      })
    }

    // Check subscription status
    const hasSubscription = await checkSubscriptionActive(user.id)
    const subscription = await getSubscription(user.id)
    const adminStatus = await isAdmin(user.id)

    const token = generateToken(user)

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasSubscription,
        subscription: subscription ? {
          plan: subscription.plan,
          status: subscription.status,
          expiresAt: subscription.expires_at
        } : null,
        isAdmin: adminStatus
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Login failed' })
  }
})

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const hasSubscription = await checkSubscriptionActive(user.id)
    const subscription = await getSubscription(user.id)
    const adminStatus = await isAdmin(user.id)

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasSubscription,
        subscription: subscription ? {
          plan: subscription.plan,
          status: subscription.status,
          expiresAt: subscription.expires_at
        } : null,
        isAdmin: adminStatus
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ success: false, message: 'Failed to get user info' })
  }
})

/**
 * POST /api/auth/verify-token
 * Verify if token is still valid
 */
router.post('/verify-token', authenticateToken, (req, res) => {
  res.json({ 
    success: true, 
    valid: true,
    user: req.user
  })
})

export default router
