import dotenv from 'dotenv'
dotenv.config() // Load env vars FIRST

import express from 'express'
import cors from 'cors'
import { checkConnection } from './services/supabase.js'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import progressRoutes from './routes/progress.js'
import paymentRoutes from './routes/payment.js'
import adminRoutes from './routes/admin.js'

const app = express()
const PORT = process.env.PORT || 5000

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Request logging (for debugging)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`)
    next()
  })
}

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', async (req, res) => {
  const dbConnected = await checkConnection()
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      database: dbConnected ? 'connected' : 'disconnected',
      ai: !!process.env.GROQ_API_KEY ? 'configured' : 'not configured',
      payments: !!process.env.RAZORPAY_KEY_ID ? 'configured' : 'not configured'
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  })
})

// Start server
async function startServer() {
  // Check database connection
  const dbConnected = await checkConnection()
  
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                    🌱 DevSprout API                        ║
╠════════════════════════════════════════════════════════════╣
║  Server running on http://localhost:${PORT}                   ║
╠════════════════════════════════════════════════════════════╣
║  Services Status:                                          ║
║  ${dbConnected ? '✅' : '❌'} Database (Supabase)   ${dbConnected ? 'Connected' : 'Not connected - check SUPABASE_URL'}     ║
║  ${process.env.GROQ_API_KEY ? '✅' : '⚠️ '} AI (Groq)            ${process.env.GROQ_API_KEY ? 'Configured' : 'Not configured'}        ║
║  ${process.env.RAZORPAY_KEY_ID ? '✅' : '⚠️ '} Payments (Razorpay) ${process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Not configured'}        ║
╚════════════════════════════════════════════════════════════╝
    `)
  })
}

startServer()
