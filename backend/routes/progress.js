import express from 'express'
import { authenticateToken, requireSubscription } from './auth.js'
import {
  getProgress,
  upsertProgress,
  getAllProgress,
  markSubtopicComplete
} from '../services/supabase.js'

const router = express.Router()

/**
 * GET /api/progress
 * Get all progress for current user
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const progress = await getAllProgress(req.user.userId)
    
    // Convert to the format frontend expects
    const progressMap = {}
    progress.forEach(p => {
      const key = `${p.topic_id}-${p.subtopic_id}`
      progressMap[key] = {
        status: p.status,
        phase: p.phase,
        assignmentsCompleted: p.assignments_completed,
        startedAt: p.started_at,
        completedAt: p.completed_at
      }
    })

    res.json({ success: true, progress: progressMap })
  } catch (error) {
    console.error('Get progress error:', error)
    res.status(500).json({ success: false, message: 'Failed to get progress' })
  }
})

/**
 * GET /api/progress/:topicId/:subtopicId
 * Get progress for specific subtopic
 */
router.get('/:topicId/:subtopicId', authenticateToken, async (req, res) => {
  try {
    const { topicId, subtopicId } = req.params
    const progress = await getProgress(req.user.userId, topicId, subtopicId)

    res.json({
      success: true,
      progress: progress ? {
        status: progress.status,
        phase: progress.phase,
        assignmentsCompleted: progress.assignments_completed,
        startedAt: progress.started_at,
        completedAt: progress.completed_at
      } : {
        status: 'not_started',
        phase: 'learning',
        assignmentsCompleted: 0
      }
    })
  } catch (error) {
    console.error('Get subtopic progress error:', error)
    res.status(500).json({ success: false, message: 'Failed to get progress' })
  }
})

/**
 * POST /api/progress/:topicId/:subtopicId/start
 * Mark subtopic as started
 */
router.post('/:topicId/:subtopicId/start', authenticateToken, requireSubscription, async (req, res) => {
  try {
    const { topicId, subtopicId } = req.params
    
    const progress = await upsertProgress(req.user.userId, topicId, subtopicId, {
      status: 'in_progress',
      phase: 'learning',
      started_at: new Date().toISOString()
    })

    res.json({
      success: true,
      message: 'Subtopic started',
      progress: {
        status: progress.status,
        phase: progress.phase
      }
    })
  } catch (error) {
    console.error('Start subtopic error:', error)
    res.status(500).json({ success: false, message: 'Failed to start subtopic' })
  }
})

/**
 * POST /api/progress/:topicId/:subtopicId/phase
 * Update learning phase
 */
router.post('/:topicId/:subtopicId/phase', authenticateToken, requireSubscription, async (req, res) => {
  try {
    const { topicId, subtopicId } = req.params
    const { phase } = req.body

    if (!['learning', 'assignment'].includes(phase)) {
      return res.status(400).json({ success: false, message: 'Invalid phase' })
    }

    const progress = await upsertProgress(req.user.userId, topicId, subtopicId, {
      phase
    })

    res.json({
      success: true,
      message: `Phase updated to ${phase}`,
      progress: {
        status: progress.status,
        phase: progress.phase
      }
    })
  } catch (error) {
    console.error('Update phase error:', error)
    res.status(500).json({ success: false, message: 'Failed to update phase' })
  }
})

/**
 * POST /api/progress/:topicId/:subtopicId/assignment
 * Increment completed assignments count
 */
router.post('/:topicId/:subtopicId/assignment', authenticateToken, requireSubscription, async (req, res) => {
  try {
    const { topicId, subtopicId } = req.params
    
    // Get current progress
    const current = await getProgress(req.user.userId, topicId, subtopicId)
    const currentCount = current?.assignments_completed || 0

    const progress = await upsertProgress(req.user.userId, topicId, subtopicId, {
      assignments_completed: currentCount + 1
    })

    res.json({
      success: true,
      message: 'Assignment completed',
      progress: {
        assignmentsCompleted: progress.assignments_completed
      }
    })
  } catch (error) {
    console.error('Complete assignment error:', error)
    res.status(500).json({ success: false, message: 'Failed to record assignment' })
  }
})

/**
 * POST /api/progress/:topicId/:subtopicId/complete
 * Mark subtopic as completed
 */
router.post('/:topicId/:subtopicId/complete', authenticateToken, requireSubscription, async (req, res) => {
  try {
    const { topicId, subtopicId } = req.params
    
    const progress = await markSubtopicComplete(req.user.userId, topicId, subtopicId)

    res.json({
      success: true,
      message: 'Subtopic completed!',
      progress: {
        status: progress.status,
        completedAt: progress.completed_at
      }
    })
  } catch (error) {
    console.error('Complete subtopic error:', error)
    res.status(500).json({ success: false, message: 'Failed to complete subtopic' })
  }
})

/**
 * DELETE /api/progress/:topicId/:subtopicId
 * Reset progress for a subtopic (for retrying)
 */
router.delete('/:topicId/:subtopicId', authenticateToken, async (req, res) => {
  try {
    const { topicId, subtopicId } = req.params
    
    await upsertProgress(req.user.userId, topicId, subtopicId, {
      status: 'not_started',
      phase: 'learning',
      assignments_completed: 0,
      started_at: null,
      completed_at: null
    })

    res.json({
      success: true,
      message: 'Progress reset'
    })
  } catch (error) {
    console.error('Reset progress error:', error)
    res.status(500).json({ success: false, message: 'Failed to reset progress' })
  }
})

export default router
