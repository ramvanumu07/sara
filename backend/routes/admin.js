import express from 'express'
import { authenticateToken, requireAdmin } from './auth.js'
import {
  getPlatformStats,
  getAllUsers,
  makeAdmin,
  supabaseAdmin
} from '../services/supabase.js'

const router = express.Router()

/**
 * GET /api/admin/stats
 * Get platform statistics
 */
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await getPlatformStats()
    
    // Get additional stats
    const { data: recentUsers } = await supabaseAdmin
      .from('users')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: recentSubscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('*, users(name, email)')
      .order('created_at', { ascending: false })
      .limit(5)

    res.json({
      success: true,
      stats: {
        ...stats,
        totalRevenue: stats.total_revenue / 100, // Convert paise to rupees
        recentUsers,
        recentSubscriptions
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ success: false, message: 'Failed to get stats' })
  }
})

/**
 * GET /api/admin/users
 * Get all users with pagination
 */
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const offset = (page - 1) * limit

    const users = await getAllUsers(limit, offset)
    
    // Get total count
    const { count } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ success: false, message: 'Failed to get users' })
  }
})

/**
 * GET /api/admin/users/:userId
 * Get detailed user info
 */
router.get('/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*, subscriptions(*)')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Get user's progress
    const { data: progress } = await supabaseAdmin
      .from('progress')
      .select('*')
      .eq('user_id', userId)

    // Get user's AI usage
    const { data: usage } = await supabaseAdmin
      .from('ai_usage')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(30)

    res.json({
      success: true,
      user: {
        ...user,
        progress,
        aiUsage: usage
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ success: false, message: 'Failed to get user' })
  }
})

/**
 * GET /api/admin/subscriptions
 * Get all subscriptions
 */
router.get('/subscriptions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const offset = (page - 1) * limit
    const status = req.query.status // Filter by status

    let query = supabaseAdmin
      .from('subscriptions')
      .select('*, users(name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: subscriptions, count, error } = await query

    if (error) throw error

    res.json({
      success: true,
      subscriptions,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Get subscriptions error:', error)
    res.status(500).json({ success: false, message: 'Failed to get subscriptions' })
  }
})

/**
 * POST /api/admin/users/:userId/make-admin
 * Make a user an admin
 */
router.post('/users/:userId/make-admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params

    await makeAdmin(userId)

    res.json({
      success: true,
      message: 'User is now an admin'
    })
  } catch (error) {
    console.error('Make admin error:', error)
    res.status(500).json({ success: false, message: 'Failed to make user admin' })
  }
})

/**
 * POST /api/admin/subscriptions/:subscriptionId/extend
 * Extend a subscription
 */
router.post('/subscriptions/:subscriptionId/extend', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { subscriptionId } = req.params
    const { days = 30 } = req.body

    const { data: subscription, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single()

    if (fetchError || !subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' })
    }

    const currentExpiry = new Date(subscription.expires_at)
    const newExpiry = new Date(currentExpiry)
    newExpiry.setDate(newExpiry.getDate() + days)

    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({ 
        expires_at: newExpiry.toISOString(),
        status: 'active'
      })
      .eq('id', subscriptionId)

    if (updateError) throw updateError

    res.json({
      success: true,
      message: `Subscription extended by ${days} days`,
      newExpiryDate: newExpiry.toISOString()
    })
  } catch (error) {
    console.error('Extend subscription error:', error)
    res.status(500).json({ success: false, message: 'Failed to extend subscription' })
  }
})

/**
 * POST /api/admin/subscriptions/:subscriptionId/cancel
 * Cancel a subscription
 */
router.post('/subscriptions/:subscriptionId/cancel', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { subscriptionId } = req.params

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscriptionId)

    if (error) throw error

    res.json({
      success: true,
      message: 'Subscription cancelled'
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    res.status(500).json({ success: false, message: 'Failed to cancel subscription' })
  }
})

/**
 * GET /api/admin/revenue
 * Get revenue analytics
 */
router.get('/revenue', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get daily revenue for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: revenueData, error } = await supabaseAdmin
      .from('subscriptions')
      .select('amount, created_at')
      .not('razorpay_payment_id', 'is', null)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    // Group by date
    const dailyRevenue = {}
    revenueData.forEach(sub => {
      const date = sub.created_at.split('T')[0]
      dailyRevenue[date] = (dailyRevenue[date] || 0) + sub.amount
    })

    // Calculate totals
    const totalRevenue = revenueData.reduce((sum, sub) => sum + sub.amount, 0)
    const avgDaily = totalRevenue / 30

    res.json({
      success: true,
      revenue: {
        total: totalRevenue / 100, // Convert paise to rupees
        avgDaily: avgDaily / 100,
        currency: 'INR',
        dailyBreakdown: Object.entries(dailyRevenue).map(([date, amount]) => ({
          date,
          amount: amount / 100
        }))
      }
    })
  } catch (error) {
    console.error('Get revenue error:', error)
    res.status(500).json({ success: false, message: 'Failed to get revenue data' })
  }
})

export default router

