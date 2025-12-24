import express from 'express'
import { authenticateToken } from './auth.js'
import { 
  createOrder, 
  verifyPaymentSignature, 
  getPaymentDetails,
  getPricingInfo 
} from '../services/razorpay.js'
import { 
  createSubscription, 
  verifyPayment,
  getUserById,
  getSubscription
} from '../services/supabase.js'

const router = express.Router()

/**
 * GET /api/payment/pricing
 * Get subscription pricing information
 */
router.get('/pricing', (req, res) => {
  const pricing = getPricingInfo()
  res.json({ success: true, pricing })
})

/**
 * POST /api/payment/create-order
 * Create a new Razorpay order for subscription
 */
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Check if user already has active subscription
    const existingSubscription = await getSubscription(user.id)
    if (existingSubscription && existingSubscription.status === 'active') {
      const expiresAt = new Date(existingSubscription.expires_at)
      if (expiresAt > new Date()) {
        return res.status(400).json({ 
          success: false, 
          message: 'You already have an active subscription',
          subscription: {
            expiresAt: existingSubscription.expires_at
          }
        })
      }
    }

    // Create Razorpay order
    const order = await createOrder(user.id, user.email, user.name)

    // Create pending subscription in database
    await createSubscription(user.id, {
      amount: order.amount,
      orderId: order.orderId
    })

    res.json({
      success: true,
      order: {
        id: order.orderId,
        amount: order.amount,
        currency: order.currency
      },
      key: process.env.RAZORPAY_KEY_ID, // Public key for frontend
      user: {
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ success: false, message: 'Failed to create order' })
  }
})

/**
 * POST /api/payment/verify
 * Verify payment after Razorpay checkout
 */
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing payment verification data' 
      })
    }

    // Verify signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature
    )

    if (!isValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature' 
      })
    }

    // Get payment details from Razorpay
    const paymentDetails = await getPaymentDetails(razorpay_payment_id)
    
    if (paymentDetails.status !== 'captured') {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment not captured' 
      })
    }

    // Update subscription in database
    const subscription = await verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    res.json({
      success: true,
      message: 'Payment successful! Your subscription is now active.',
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.expires_at
      }
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(500).json({ success: false, message: 'Payment verification failed' })
  }
})

/**
 * GET /api/payment/status
 * Get current subscription status
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const subscription = await getSubscription(req.user.userId)
    
    if (!subscription) {
      return res.json({
        success: true,
        hasSubscription: false,
        subscription: null
      })
    }

    const isActive = subscription.status === 'active' && 
                     new Date(subscription.expires_at) > new Date()

    res.json({
      success: true,
      hasSubscription: isActive,
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.expires_at,
        daysRemaining: isActive 
          ? Math.ceil((new Date(subscription.expires_at) - new Date()) / (1000 * 60 * 60 * 24))
          : 0
      }
    })
  } catch (error) {
    console.error('Get subscription status error:', error)
    res.status(500).json({ success: false, message: 'Failed to get subscription status' })
  }
})

/**
 * Razorpay Webhook handler
 * POST /api/payment/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    const signature = req.headers['x-razorpay-signature']

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' })
    }

    const event = JSON.parse(req.body)
    
    switch (event.event) {
      case 'payment.captured':
        // Payment successful - already handled in /verify
        console.log('Payment captured:', event.payload.payment.entity.id)
        break
      
      case 'payment.failed':
        console.log('Payment failed:', event.payload.payment.entity.id)
        // Could update subscription status to failed
        break
      
      case 'refund.created':
        console.log('Refund created:', event.payload.refund.entity.id)
        // Could update subscription status
        break
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ success: false })
  }
})

export default router

