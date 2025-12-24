import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// Subscription amount in paise (₹200 = 20000 paise)
const SUBSCRIPTION_AMOUNT = 20000
const CURRENCY = 'INR'

/**
 * Create a new Razorpay order for subscription
 */
export async function createOrder(userId, userEmail, userName) {
  const options = {
    amount: SUBSCRIPTION_AMOUNT,
    currency: CURRENCY,
    receipt: `devsprout_${userId}_${Date.now()}`,
    notes: {
      user_id: userId,
      user_email: userEmail,
      user_name: userName,
      plan: 'basic',
      duration: '1_month'
    }
  }

  try {
    const order = await razorpay.orders.create(options)
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    }
  } catch (error) {
    console.error('Razorpay order creation error:', error)
    throw new Error('Failed to create payment order')
  }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyPaymentSignature(orderId, paymentId, signature) {
  const body = orderId + '|' + paymentId
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')
  
  return expectedSignature === signature
}

/**
 * Fetch payment details from Razorpay
 */
export async function getPaymentDetails(paymentId) {
  try {
    const payment = await razorpay.payments.fetch(paymentId)
    return {
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      created_at: payment.created_at
    }
  } catch (error) {
    console.error('Razorpay fetch payment error:', error)
    throw new Error('Failed to fetch payment details')
  }
}

/**
 * Initiate refund for a payment
 */
export async function initiateRefund(paymentId, amount = null) {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount, // null for full refund
      speed: 'normal',
      notes: {
        reason: 'Customer request'
      }
    })
    return refund
  } catch (error) {
    console.error('Razorpay refund error:', error)
    throw new Error('Failed to initiate refund')
  }
}

/**
 * Get subscription pricing info
 */
export function getPricingInfo() {
  return {
    amount: SUBSCRIPTION_AMOUNT / 100, // Convert paise to rupees
    currency: CURRENCY,
    duration: '1 month',
    features: [
      'Full access to all JavaScript lessons',
      'AI-powered personalized learning',
      'Unlimited practice assignments',
      'Progress tracking',
      'Certificate on completion'
    ]
  }
}

