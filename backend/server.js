import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { initSupabase, testConnection } from './services/supabase.js'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import progressRoutes from './routes/progress.js'
import learningRoutes from './routes/learning.js'

// Initialize Supabase after dotenv loads
initSupabase()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/learn', learningRoutes)

// Health check
app.get('/health', async (req, res) => {
  const dbConnected = await testConnection()
  res.json({
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected',
    ai: process.env.GROQ_API_KEY ? 'configured' : 'missing'
  })
})

// Start server
app.listen(PORT, async () => {
  console.log('')
  console.log('╔════════════════════════════════════════════╗')
  console.log('║         🌱 EduBridge API Server            ║')
  console.log('╠════════════════════════════════════════════╣')
  console.log(`║  Server:   http://localhost:${PORT}            ║`)

  const dbOk = await testConnection()
  console.log(`║  Database: ${dbOk ? '✅ Connected' : '❌ Not connected'}              ║`)
  console.log(`║  AI:       ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Missing key'}              ║`)
  console.log('╚════════════════════════════════════════════╝')
  console.log('')
})
