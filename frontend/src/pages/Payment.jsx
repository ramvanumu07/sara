import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../config/api'

export default function Payment() {
  const { user, updateSubscription, hasActiveSubscription } = useAuth()
  const navigate = useNavigate()
  const [pricing, setPricing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Redirect if already subscribed
    if (hasActiveSubscription()) {
      navigate('/dashboard')
      return
    }

    // Load pricing info
    const loadPricing = async () => {
      try {
        const response = await api.get('/api/payment/pricing')
        if (response.data.success) {
          setPricing(response.data.pricing)
        }
      } catch (err) {
        setError('Failed to load pricing information')
      } finally {
        setLoading(false)
      }
    }

    loadPricing()
    loadRazorpayScript()
  }, [hasActiveSubscription, navigate])

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    try {
      setProcessing(true)
      setError(null)

      // Create order
      const orderResponse = await api.post('/api/payment/create-order')
      
      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message)
      }

      const { order, key, user: orderUser } = orderResponse.data

      // Open Razorpay checkout
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'DevSprout',
        description: 'Monthly Subscription - Full JavaScript Course',
        order_id: order.id,
        prefill: {
          name: orderUser.name,
          email: orderUser.email
        },
        theme: {
          color: '#10b981'
        },
        handler: async (response) => {
          // Verify payment
          try {
            const verifyResponse = await api.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })

            if (verifyResponse.data.success) {
              updateSubscription(verifyResponse.data.subscription)
              navigate('/dashboard', { 
                state: { message: 'Payment successful! Welcome to DevSprout! 🌱' }
              })
            } else {
              setError('Payment verification failed. Please contact support.')
            }
          } catch (err) {
            setError('Payment verification failed. Please contact support.')
          }
          setProcessing(false)
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment failed')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🌱 DevSprout
          </h1>
          <p className="text-slate-400">
            Start your JavaScript journey today
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium mb-4">
              Full Access
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold text-white">₹{pricing?.amount || 200}</span>
              <span className="text-slate-400">/month</span>
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-4 mb-8">
            {(pricing?.features || [
              'Full access to all JavaScript lessons',
              'AI-powered personalized learning',
              'Unlimited practice assignments',
              'Progress tracking',
              'Certificate on completion'
            ]).map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Subscribe Now
              </>
            )}
          </button>

          {/* Secure Payment Note */}
          <p className="text-center text-slate-500 text-sm mt-4">
            🔒 Secure payment powered by Razorpay
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            ← Go back
          </button>
        </div>
      </div>
    </div>
  )
}

