/**
 * Progress Manager - Sara Learning Platform
 * Centralized progress tracking with proper state management
 * Industry-level progress tracking logic
 */

import { upsertProgress, getProgress } from './database.js'
import { findTopicById, getAllTopics } from '../utils/curriculum.js'
import { courses } from '../../data/curriculum.js'

// ============ PROGRESS STATE DEFINITIONS ============

export const PROGRESS_STATES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
}

export const PHASES = {
  SESSION: 'session',
  PLAYTIME: 'playtime', 
  ASSIGNMENT: 'assignment'
}

// ============ CORE PROGRESS MANAGEMENT ============

/**
 * Initialize progress for a topic (first time user starts)
 * This creates the initial progress record
 */
export async function initializeTopicProgress(userId, topicId) {
  const topic = findTopicById(courses, topicId)
  if (!topic) {
    throw new Error(`Topic not found: ${topicId}`)
  }

  const progressData = {
    phase: PHASES.SESSION,
    status: 'in_progress',
    current_task: 1,
    total_tasks: topic.tasks?.length || 0,
    assignments_completed: 0,
    updated_at: new Date().toISOString()
  }

  await upsertProgress(userId, topicId, progressData)

  return progressData
}

/**
 * Mark session phase as completed
 */
export async function completeSessionPhase(userId, topicId) {
  try {
    const currentProgress = await getProgress(userId, topicId)

    const progressUpdate = {
      phase: PHASES.ASSIGNMENT,  // 2-phase model: (session<->play) done → assignment
      status: 'in_progress',
      updated_at: new Date().toISOString()
    }

    await upsertProgress(userId, topicId, progressUpdate)

    return progressUpdate
  } catch (error) {
    throw error
  }
}

/**
 * Start playtime phase
 */
export async function startPlaytimePhase(userId, topicId) {
  const progressUpdate = {
    phase: PHASES.PLAYTIME,
    updated_at: new Date().toISOString()
    // Keep status as 'in_progress'
  }

  await upsertProgress(userId, topicId, progressUpdate)

  return progressUpdate
}

/**
 * Complete playtime phase
 */
export async function completePlaytimePhase(userId, topicId) {
  try {
    const currentProgress = await getProgress(userId, topicId)

    const progressUpdate = {
      phase: PHASES.ASSIGNMENT,
      status: 'in_progress',
      updated_at: new Date().toISOString()
    }

    await upsertProgress(userId, topicId, progressUpdate)

    return progressUpdate
  } catch (error) {
    throw error
  }
}

/**
 * Start assignment phase
 */
export async function startAssignmentPhase(userId, topicId) {
  const topic = findTopicById(courses, topicId)
  const totalAssignments = topic?.tasks?.length || 0

  const progressUpdate = {
    phase: PHASES.ASSIGNMENT,
    total_tasks: totalAssignments,
    current_task: 1,
    updated_at: new Date().toISOString()
  }

  await upsertProgress(userId, topicId, progressUpdate)

  return progressUpdate
}

/**
 * Complete a single assignment
 */
export async function completeAssignment(userId, topicId, assignmentIndex) {
  const currentProgress = await getProgress(userId, topicId)
  if (!currentProgress) {
    throw new Error(`No progress found for topic ${topicId}`)
  }

  const completedAssignments = (currentProgress.assignments_completed || 0) + 1
  const totalAssignments = currentProgress.total_tasks || 0
  const isTopicComplete = totalAssignments > 0 && completedAssignments >= totalAssignments

  const progressUpdate = {
    phase: PHASES.ASSIGNMENT,
    current_task: Math.min(assignmentIndex + 1, Math.max(0, totalAssignments - 1)),
    assignments_completed: completedAssignments,
    updated_at: new Date().toISOString()
  }

  if (isTopicComplete) {
    progressUpdate.status = PROGRESS_STATES.COMPLETED
    progressUpdate.status = 'completed'
  }

  await upsertProgress(userId, topicId, progressUpdate)
  
  return {
    ...progressUpdate,
    isTopicComplete,
    completedAssignments,
    totalAssignments
  }
}

/**
 * Get progress summary for a user
 */
export async function getProgressSummary(userId) {
  const { getAllProgress } = await import('./database.js')
  const allProgress = await getAllProgress(userId)
  
  // Get total topics from curriculum
  const allTopics = getAllTopics(courses)
  const totalTopics = allTopics.length

  // Calculate accurate counts
  const completedTopics = allProgress.filter(p => p.status === 'completed').length
  const inProgressTopics = allProgress.filter(p => p.status === 'in_progress').length
  const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

  return {
    total_topics: totalTopics,
    completed_topics: completedTopics,
    in_progress_topics: inProgressTopics,
    completion_percentage: completionPercentage,
    progress_records: allProgress
  }
}

/**
 * Reset all progress for a user (for testing)
 */
export async function resetUserProgress(userId) {
  const { getSupabaseClient } = await import('./database.js')
  const { progressCache } = await import('../middleware/performance.js')
  const supabase = getSupabaseClient()

  const tables = ['progress', 'chat_sessions']

  for (const table of tables) {
    try {
      await supabase
        .from(table)
        .delete()
        .eq('user_id', userId)
    } catch (err) {
      // Continue with other tables
    }
  }

  progressCache.clear()

  return { success: true, message: 'All progress reset successfully' }
}

// ============ VALIDATION HELPERS ============

/**
 * Check if user can access a specific phase
 */
export async function canAccessPhase(userId, topicId, targetPhase) {
  const progress = await getProgress(userId, topicId)
  
  if (!progress) {
    // No progress - can only access session
    return targetPhase === PHASES.SESSION
  }

  const { phase, status } = progress
  switch (targetPhase) {
    case PHASES.SESSION:
      return true
    case PHASES.PLAYTIME:
      return phase === PHASES.PLAYTIME || (phase === PHASES.SESSION && status === 'completed')
    case PHASES.ASSIGNMENT:
      return phase === PHASES.ASSIGNMENT || (phase === PHASES.SESSION && status === 'completed') || (phase === PHASES.PLAYTIME && status === 'completed')
    default:
      return false
  }
}

/**
 * Get next recommended phase for a user
 */
export async function getNextPhase(userId, topicId) {
  const progress = await getProgress(userId, topicId)
  
  if (!progress) {
    return PHASES.SESSION
  }

  if (progress.status === 'completed') {
    return null
  }

  if (progress.phase === PHASES.SESSION && progress.status !== 'completed') {
    return PHASES.SESSION
  }

  if (progress.phase === PHASES.PLAYTIME && progress.status !== 'completed') {
    return PHASES.PLAYTIME
  }

  return PHASES.ASSIGNMENT
}

export default {
  initializeTopicProgress,
  completeSessionPhase,
  startPlaytimePhase,
  completePlaytimePhase,
  startAssignmentPhase,
  completeAssignment,
  getProgressSummary,
  resetUserProgress,
  canAccessPhase,
  getNextPhase,
  PROGRESS_STATES,
  PHASES
}