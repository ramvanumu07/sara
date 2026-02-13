import express from 'express'
import { authenticateToken } from './auth.js'
import { getAllProgress, upsertProgress } from '../services/database.js'
import { handleErrorResponse, createErrorResponse, createSuccessResponse } from '../utils/responses.js'

const router = express.Router()

// DEPRECATED: Use /learn/progress instead
router.get('/', authenticateToken, async (req, res) => {
  try {
    const progress = await getAllProgress(req.user.userId)

    // Convert to frontend format (for backward compatibility)
    const formatted = {}
    for (const p of progress) {
      const key = p.topic_id
      formatted[key] = {
        status: p.status,
        phase: p.phase || 'session',
        tasksCompleted: p.assignments_completed ?? 0
      }
    }

    res.json(createSuccessResponse({ progress: formatted }))
  } catch (error) {
    handleErrorResponse(res, error, 'get progress')
  }
})

// Update progress for a topic
router.post('/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    const { 
      topicId, 
      phase, 
      status, 
      nextPhase,
      currentAssignment,
      totalAssignments,
      completedAssignments,
      topicCompleted,
      updatedAt
    } = req.body

    if (!topicId) {
      return res.status(400).json(createErrorResponse('Topic ID is required'))
    }

    // Prepare progress data
    const progressData = {
      status: status || 'in_progress',
      phase: phase || 'session',
      updated_at: updatedAt || new Date().toISOString()
    }

    // Add optional fields if provided (match progress table: current_task, total_tasks; no topic_completed column)
    if (nextPhase) progressData.phase = nextPhase
    if (currentAssignment !== undefined) progressData.current_task = currentAssignment
    if (totalAssignments !== undefined) progressData.total_tasks = totalAssignments
    if (completedAssignments !== undefined) progressData.assignments_completed = completedAssignments

    // Update progress in database
    await upsertProgress(userId, topicId, progressData)

    res.json(createSuccessResponse(progressData, 'Progress updated successfully'))

  } catch (error) {
    handleErrorResponse(res, error, 'Failed to update progress')
  }
})

export default router
