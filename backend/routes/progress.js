import express from 'express'
import { authenticateToken } from './auth.js'
import { getAllProgress } from '../services/supabase.js'

const router = express.Router()

// Get all progress for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const progress = await getAllProgress(req.user.userId)
    
    // Convert to frontend format
    const formatted = {}
    for (const p of progress) {
      const key = `${p.topic_id}-${p.subtopic_id}`
      formatted[key] = {
        status: p.status,
        phase: p.phase || 'session',
        tasksCompleted: p.current_task || 0,
        startedAt: p.started_at,
        completedAt: p.completed_at
      }
    }
    
    res.json({ success: true, progress: formatted })
  } catch (error) {
    console.error('Get progress error:', error)
    res.status(500).json({ success: false, message: 'Failed to get progress' })
  }
})

export default router
