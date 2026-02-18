/**
 * Learning Routes - Sara Learning Platform
 * Single-topic architecture with enhanced features
 */

import express from 'express'
import fs from 'fs'
import path from 'path'
import { authenticateToken } from './auth.js'
import { callAI } from '../services/ai.js'
import {
  getProgress,
  upsertProgress,
  getAllProgress,
  getLastAccessedTopic,
  getCompletedTopics,
  getUserProgressSummary,
  getUnlockedCourseIds,
  isCourseUnlockedForUser,
  unlockCourseForUser,
  isAdmin,
  createUnlockSlot,
  redeemUnlockCode
} from '../services/database.js'
import progressManager from '../services/progressManager.js'
import { saveChatTurn, saveInitialMessage, clearChatHistory, getChatHistoryString, getChatHistory } from '../services/chatService.js'
import { courses } from '../../data/curriculum.js'
import { formatLearningObjectives, findTopicById, getAllTopics } from '../utils/curriculum.js'
import { getTopicOrRespond } from '../utils/topicHelper.js'
import { handleErrorResponse, createSuccessResponse, createErrorResponse } from '../utils/responses.js'
import { rateLimitMiddleware } from '../middleware/rateLimiting.js'
import { buildSessionPrompt as buildSessionPromptFromShared } from '../prompts/sessionPrompt.js'

const router = express.Router()

// ============ VALIDATION SCHEMAS ============
const schemas = {
  sessionStart: {
    required: ['topicId'],
    optional: ['assignments']
  },
  playtimeStart: {
    required: ['topicId'],
    optional: []
  },
  assignmentStart: {
    required: ['topicId'],
    optional: []
  },
  playtimeComplete: {
    required: ['topicId'],
    optional: []
  },
  assignmentComplete: {
    required: ['topicId', 'assignmentIndex'],
    optional: []
  }
}

function validateBody(schema) {
  return (req, res, next) => {
    const { required = [], optional = [] } = schema
    const allowedFields = [...required, ...optional]

    // Check required fields
    for (const field of required) {
      if (!req.body[field]) {
        return res.status(400).json(createErrorResponse(`${field} is required`))
      }
    }

    // Remove unexpected fields
    const cleanBody = {}
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        cleanBody[field] = req.body[field]
      }
    }
    req.body = cleanBody

    next()
  }
}

// ============ UTILITY FUNCTIONS ============

import SecureCodeExecutor from '../services/SecureCodeExecutor.js';
const codeExecutor = new SecureCodeExecutor();

// Industry-level secure code execution function
async function executeCodeSecurely(code, testCases = [], functionName = null, solutionType = 'script') {
  try {
    // Validate inputs
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid code provided');
    }

    if (!Array.isArray(testCases)) {
      throw new Error('Test cases must be an array');
    }

    // Execute code with new secure executor
    const result = await codeExecutor.execute(code, testCases, functionName, solutionType);

    return {
      success: result.success,
      output: result.results?.map(r => r.output || r.result).join('\n') || '',
      testResults: result.results || [],
      allTestsPassed: result.allPassed || false,
      executionTime: result.executionTime,
      error: result.error
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      output: '',
      testResults: [],
      allTestsPassed: false,
      executionTime: 0
    };
  }
}

function buildSessionPrompt(topicId, conversationHistory, completedTopics = []) {
  const topic = findTopicById(courses, topicId)
  if (!topic) {
    throw new Error(`Topic not found: ${topicId}`)
  }
  const goals = formatLearningObjectives(topic.outcomes)
  const completedList = completedTopics.length > 0
    ? `\n\nCompleted Topics: ${completedTopics.join(', ')}`
    : ''
  return buildSessionPromptFromShared({
    topicTitle: topic.title,
    goals,
    conversationHistory,
    completedList
  })
}

async function getCompletedTopicsForUser(userId) {
  try {
    const completedTopics = await getCompletedTopics(userId)
    return completedTopics
  } catch (error) {
    return []
  }
}

// Require course to be unlocked for user (used for topic access)
async function requireCourseUnlocked(req, res, next) {
  const topicId = req.params.topicId || req.body?.topicId
  if (!topicId) return next()
  const topic = findTopicById(courses, topicId)
  if (!topic) return next()
  const courseId = topic.courseId
  const userId = req.user?.userId
  if (!userId) return next()
  const unlocked = await isCourseUnlockedForUser(userId, courseId)
  if (!unlocked) {
    return res.status(403).json(createErrorResponse('This course is locked. Unlock it to continue.', 'COURSE_LOCKED', { courseId }))
  }
  next()
}

// ============ COURSE UNLOCK (payment flow) ============

router.get('/unlocked-courses', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    const courseIds = await getUnlockedCourseIds(userId)
    res.json(createSuccessResponse({ courseIds }))
  } catch (error) {
    handleErrorResponse(res, error, 'get unlocked courses')
  }
})

router.post('/unlock-course', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    const { courseId } = req.body || {}
    if (!courseId || typeof courseId !== 'string') {
      return res.status(400).json(createErrorResponse('courseId is required'))
    }
    // In production: verify payment (Stripe/Razorpay webhook or server-side confirmation) before unlocking
    await unlockCourseForUser(userId, courseId.trim())
    res.json(createSuccessResponse({ message: 'Course unlocked', courseId: courseId.trim() }))
  } catch (error) {
    handleErrorResponse(res, error, 'unlock course')
  }
})

// Generate one unlock code (admin only). Creates a row in user_course_unlocks with user_id null; id is the code.
const DEFAULT_UNLOCK_COURSE_ID = 'javascript'
router.post('/generate-unlock-code', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    const admin = await isAdmin(userId)
    if (!admin) {
      return res.status(403).json(createErrorResponse('Admin only'))
    }
    const slot = await createUnlockSlot(DEFAULT_UNLOCK_COURSE_ID)
    res.json(createSuccessResponse({ code: slot.id, courseId: slot.course_id }))
  } catch (error) {
    handleErrorResponse(res, error, 'generate unlock code')
  }
})

// Redeem unlock code (id of a user_course_unlocks row). Updates row with current user_id so user gets access.
router.post('/redeem-unlock-code', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    const { code } = req.body || {}
    if (!code || typeof code !== 'string') {
      return res.status(400).json(createErrorResponse('Code is required'))
    }
    const result = await redeemUnlockCode(userId, code.trim())
    res.json(createSuccessResponse({ message: 'Course unlocked', courseId: result.courseId }))
  } catch (error) {
    const message = error.message || 'Failed to redeem code'
    if (message.includes('Invalid') || message.includes('already used')) {
      return res.status(400).json(createErrorResponse(message))
    }
    handleErrorResponse(res, error, 'redeem unlock code')
  }
})

// ============ LEARNING STATE MANAGEMENT ============

router.get('/state/:topicId', authenticateToken, requireCourseUnlocked, async (req, res) => {
  try {
    const { topicId } = req.params
    const userId = req.user.userId

    // Validate topic exists
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    // Get progress and chat history in parallel
    const [progress, chatHistory] = await Promise.all([
      getProgress(userId, topicId),
      getChatHistoryString(userId, topicId)
    ])

    if (!progress) {
      return res.json({
        success: true,
        exists: false,
        topic: {
          id: topicId,
          title: topic.title,
          description: topic.description,
          category: topic.category,
          difficulty: topic.difficulty,
          estimatedTime: topic.estimatedTime
        }
      })
    }

    // Normalize phase
    const normalizedPhase = progress.phase || 'session'

    const responseData = {
      success: true,
      exists: true,
      phase: normalizedPhase,
      currentAssignment: Math.max(0, (progress.current_task || 1) - 1),
      totalAssignments: progress.total_tasks || 0,
      status: progress.status,
      conversationHistory: chatHistory || '',
      assignments: [],
      topic: {
        id: topicId,
        title: topic.title,
        description: topic.description,
        category: topic.category,
        difficulty: topic.difficulty,
        estimatedTime: topic.estimatedTime
      }
    }

    res.json(responseData)
  } catch (error) {
    handleErrorResponse(res, error, 'get session state')
  }
})

// ============ SESSION PHASE ============

router.post('/session/start', authenticateToken, rateLimitMiddleware, validateBody(schemas.sessionStart), requireCourseUnlocked, async (req, res) => {
  try {
    const { topicId, assignments } = req.body
    const userId = req.user.userId

    // Validate topic exists
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    // Handle empty assignments
    const taskList = assignments && assignments.length > 0
      ? assignments
      : ['Practice the concept with a simple example']

    // Initialize topic progress - direct database call for compatibility
    await upsertProgress(userId, topicId, {
      phase: 'session',
      status: 'in_progress',
      updated_at: new Date().toISOString()
    })

    // Get student context and chat history for prompt
    const [completedTopics, conversationHistory] = await Promise.all([
      getCompletedTopicsForUser(userId),
      getChatHistoryString(userId, topicId)
    ])
    const outcomes = topic ? formatLearningObjectives(topic.outcomes) : 'Learn programming concepts'

    // Build the session prompt with actual conversation history
    const sessionPrompt = buildSessionPrompt(topicId, conversationHistory || '', completedTopics)

    const messages = [
      { role: 'system', content: sessionPrompt },
      { role: 'user', content: `Start teaching the first concept.` }
    ]

    // Log finalized system prompt for testing (file + console); skip file on Vercel (read-only fs)
    if (!process.env.VERCEL) {
      const promptLogPath = path.join(process.cwd(), 'logs', 'last-system-prompt.txt')
      try {
        fs.mkdirSync(path.dirname(promptLogPath), { recursive: true })
        fs.writeFileSync(promptLogPath, `[SESSION/START] topicId=${topicId}\n---\n` + sessionPrompt, 'utf8')
      } catch (e) {
      }
    }

    // Generate initial message (idempotent - won't duplicate if conversation exists)
    const aiResponse = await callAI(messages, 800, 0.4, 'llama-3.3-70b-versatile')

    const result = await saveInitialMessage(userId, topicId, aiResponse)

    const directResponse = result.wasCreated ? aiResponse :
      result.conversationHistory?.match(/AGENT: (.+?)(?=\nUSER:|$)/s)?.[1]?.trim() || 'Session ready'

    // Get updated progress after saving
    const progress = await getProgress(userId, topicId)

    res.json({
      success: true,
      message: directResponse,
      phase: 'session',
      conceptRevealed: false,
      outcomes: outcomes || [],
      progress: progress,
      topic: {
        id: topicId,
        title: topic.title,
        description: topic.description,
        category: topic.category
      }
    })
  } catch (error) {
    handleErrorResponse(res, error, 'start session')
  }
})

// ============ PLAYTIME PHASE ============

// Play phase: user tries out code from session — no AI, just progress update
router.post('/playtime/start', authenticateToken, rateLimitMiddleware, validateBody(schemas.playtimeStart), requireCourseUnlocked, async (req, res) => {
  try {
    const { topicId } = req.body
    const userId = req.user.userId


    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    await upsertProgress(userId, topicId, {
      phase: 'playtime',
      status: 'in_progress',
      updated_at: new Date().toISOString()
    })

    res.json(createSuccessResponse({
      message: 'Practice what you learned in the session. Try out the concepts in the editor and run your code.',
      phase: 'playtime',
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'start playtime')
  }
})

// ============ PLAYTIME COMPLETION ============

// Test endpoint to verify routing
router.get('/playtime/test', (req, res) => {
  res.json({ success: true, message: 'Playtime routes are working', timestamp: new Date().toISOString() })
})

router.post('/playtime/complete', authenticateToken, rateLimitMiddleware, validateBody(schemas.playtimeComplete), requireCourseUnlocked, async (req, res) => {
  try {
    const { topicId } = req.body
    const userId = req.user.userId


    // Validate topic exists
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return


    // Complete playtime phase - direct database update for compatibility
    try {

      const result = await upsertProgress(userId, topicId, {
        phase: 'assignment',
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })

    } catch (dbError) {
      throw new Error(`Failed to complete playtime: ${dbError.message}`)
    }

    res.json(createSuccessResponse({
      message: 'Playtime completed successfully',
      phase: 'playtime',
      nextPhase: 'assignment',
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'complete playtime')
  }
})

// ============ ASSIGNMENT PHASE ============

router.post('/assignment/start', authenticateToken, rateLimitMiddleware, validateBody(schemas.assignmentStart), requireCourseUnlocked, async (req, res) => {
  try {
    const { topicId } = req.body
    const userId = req.user.userId


    // Validate topic exists
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    // Get topic tasks
    const tasks = topic.tasks || []
    if (tasks.length === 0) {
      return res.status(400).json(createErrorResponse('No assignments available for this topic'))
    }

    // Start assignment phase - direct database call for compatibility
    await upsertProgress(userId, topicId, {
      phase: 'assignment',
      status: 'in_progress',
      current_task: 1,
      total_tasks: tasks.length,
      updated_at: new Date().toISOString()
    })

    // Get first assignment
    const firstTask = tasks[0]

    res.json(createSuccessResponse({
      assignment: {
        description: firstTask.description,
        testCases: firstTask.testCases,
        currentTask: 0,
        totalTasks: tasks.length
      },
      phase: 'assignment',
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'start assignment')
  }
})

router.post('/assignment/complete', authenticateToken, rateLimitMiddleware, requireCourseUnlocked, async (req, res) => {
  try {
    const { topicId, assignmentIndex: rawIndex, code } = req.body
    const userId = req.user.userId
    const assignmentIndex = Number(rawIndex)
    if (rawIndex !== undefined && (Number.isNaN(assignmentIndex) || assignmentIndex < 0)) {
      return res.status(400).json(createErrorResponse('assignmentIndex must be a non-negative number'))
    }

    if (!topicId || rawIndex === undefined) {
      return res.status(400).json(createErrorResponse('topicId and assignmentIndex are required'))
    }

    if (!code || !code.trim()) {
      return res.status(400).json(createErrorResponse('Code is required to complete assignment'))
    }


    // Validate topic exists
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    const tasks = topic.tasks || []
    if (assignmentIndex >= tasks.length) {
      return res.status(400).json(createErrorResponse('Invalid assignment index'))
    }

    const currentTask = tasks[assignmentIndex]
    if (!currentTask) {
      return res.status(400).json(createErrorResponse('Assignment not found for this topic'))
    }
    const testCases = currentTask.testCases || []
    const solutionType = currentTask.solution_type || 'script'
    const functionName = currentTask.function_name ?? null

    // Execute code and validate against test cases with proper parameters
    const executionResult = await executeCodeSecurely(code, testCases, functionName, solutionType)

    // Check if all tests passed (only if there are test cases)
    if (testCases.length > 0 && !executionResult.allTestsPassed) {
      return res.status(400).json(createErrorResponse('Assignment not completed: Some tests are failing', {
        execution: executionResult,
        requiresAllTestsPassed: true,
        failedTests: executionResult.testResults?.filter(t => !t.passed) || []
      }))
    }

    // Complete assignment - tests passed or no tests required. Only advance when user completes the next task in sequence (no reward for skipping).
    const currentProgress = await getProgress(userId, topicId)
    const currentCount = currentProgress?.assignments_completed ?? currentProgress?.completed_assignments ?? 0
    const isNextInSequence = assignmentIndex === currentCount
    const completedAssignments = isNextInSequence ? currentCount + 1 : currentCount
    const isTopicComplete = completedAssignments >= tasks.length
    const now = new Date().toISOString()

    // current_task = 1-based "next task to do" = assignments_completed + 1 (so Continue opens the right assignment)
    const nextTaskOneBased = Math.min(completedAssignments + 1, tasks.length)
    const progressPayload = {
      phase: 'assignment',
      status: isTopicComplete ? 'completed' : 'in_progress',
      current_task: nextTaskOneBased,
      total_tasks: tasks.length,
      assignments_completed: completedAssignments,
      updated_at: now
    }

    try {
      await upsertProgress(userId, topicId, progressPayload)
    } catch (progressErr) {
      const msg = progressErr?.message || ''
      if (msg.includes('column') && msg.includes('does not exist')) {
        const minimalPayload = {
          phase: 'assignment',
          status: isTopicComplete ? 'completed' : 'in_progress',
          current_task: nextTaskOneBased,
          total_tasks: tasks.length,
          assignments_completed: completedAssignments,
          updated_at: now
        }
        try {
          await upsertProgress(userId, topicId, minimalPayload)
        } catch (minimalErr) {
          const m2 = minimalErr?.message || ''
          if (m2.includes('assignments_completed')) {
            const alt = { ...minimalPayload }
            delete alt.assignments_completed
            alt.completed_assignments = completedAssignments
            await upsertProgress(userId, topicId, alt)
          } else {
            throw minimalErr
          }
        }
      } else {
        throw progressErr
      }
    }

    const totalAssignments = tasks.length

    res.json(createSuccessResponse({
      message: isTopicComplete ? 'All assignments completed! Topic mastered!' : 'Assignment completed successfully',
      assignmentCompleted: true,
      topicCompleted: isTopicComplete,
      completedAssignments: completedAssignments,
      totalAssignments: totalAssignments,
      nextAssignment: isTopicComplete ? null : assignmentIndex + 1,
      phase: 'assignment',
      execution: executionResult,
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      }
    }))
  } catch (error) {
    if (!res.headersSent) {
      const message = error?.message || 'Complete assignment failed'
      res.status(500).json(createErrorResponse(message, 'SERVER_ERROR', process.env.NODE_ENV === 'development' ? error?.stack : null))
    }
  }
})

// ============ CODE EXECUTION ============

// Playground execution (no topic required) - for dashboard and standalone editor
router.post('/execute-playground', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body
    if (!code || typeof code !== 'string') {
      return res.status(400).json(createErrorResponse('Code is required'))
    }
    const result = await executeCodeSecurely(code, [], null, 'script')
    return res.json(createSuccessResponse({ execution: result }))
  } catch (error) {
    return res.status(500).json(createErrorResponse('Code execution failed'))
  }
})

router.post('/execute', authenticateToken, async (req, res) => {
  try {
    const { code, topicId, assignmentIndex } = req.body

    if (!code || !topicId) {
      return res.status(400).json(createErrorResponse('Code and topicId are required'))
    }

    // Get topic and assignment details
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    let testCases = []
    if (assignmentIndex !== undefined && topic.tasks && topic.tasks[assignmentIndex]) {
      testCases = topic.tasks[assignmentIndex].testCases || []
    }

    // Get task details for proper execution
    const task = assignmentIndex !== undefined && topic.tasks ? topic.tasks[assignmentIndex] : null;
    const solutionType = task?.solution_type || 'script';
    const functionName = task?.function_name || null;

    // Execute code securely with proper parameters
    const result = await executeCodeSecurely(code, testCases, functionName, solutionType)

    res.json(createSuccessResponse({
      execution: result,
      topic: {
        id: topicId,
        title: topic.title
      },
      assignment: assignmentIndex !== undefined ? {
        index: assignmentIndex,
        total: topic.tasks?.length || 0,
        solutionType: solutionType,
        functionName: functionName
      } : null
    }))

  } catch (error) {
    res.status(500).json(createErrorResponse('Code execution failed'))
  }
})

// New secure execution endpoint with enhanced validation
router.post('/execute-secure', authenticateToken, async (req, res) => {
  try {
    const { code, testCases, functionName, solutionType, topicId, assignmentIndex } = req.body;

    // Validate required parameters
    if (!code) {
      return res.status(400).json(createErrorResponse('Code is required'));
    }

    if (!testCases || !Array.isArray(testCases)) {
      return res.status(400).json(createErrorResponse('Valid test cases are required'));
    }

    if (solutionType === 'function' && !functionName) {
      return res.status(400).json(createErrorResponse('Function name is required for function-type tasks'));
    }

    // Execute with enhanced security
    const result = await executeCodeSecurely(code, testCases, functionName, solutionType);

    // Additional validation for function tasks
    if (solutionType === 'function' && result.success) {
      const hasValidResults = result.testResults.every(test =>
        test.hasOwnProperty('result') || test.hasOwnProperty('error')
      );

      if (!hasValidResults) {
        return res.status(400).json(createErrorResponse('Function execution did not return valid results'));
      }
    }

    res.json(createSuccessResponse({
      execution: result,
      validation: {
        secure: true,
        executionTime: result.executionTime,
        solutionType: solutionType,
        functionName: functionName
      }
    }));

  } catch (error) {
    res.status(500).json(createErrorResponse('Secure code execution failed'));
  }
})

// ============ PROGRESS MANAGEMENT ============

router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId

    // Get progress data directly for compatibility
    let allProgress = await getAllProgress(userId)

    // New user: ensure first-topic progress row exists (fallback if /continue wasn't called first)
    if (allProgress.length === 0) {
      const firstTopic = getAllTopics(courses)[0]
      if (firstTopic) {
        const totalTasks = (firstTopic.tasks || []).length
        await upsertProgress(userId, firstTopic.id, {
          phase: 'session',
          status: 'in_progress',
          current_task: totalTasks > 0 ? 1 : 0,
          total_tasks: totalTasks,
          assignments_completed: 0,
          updated_at: new Date().toISOString()
        })
        allProgress = await getAllProgress(userId)
      }
    }

    // Calculate summary directly
    const allTopicsFromCurriculum = getAllTopics(courses)
    const totalTopics = allTopicsFromCurriculum.length
    const completedTopics = allProgress.filter(p => p.status === 'completed').length
    const inProgressTopics = allProgress.filter(p => p.status === 'in_progress').length

    const summary = {
      total_topics: totalTopics,
      completed_topics: completedTopics,
      in_progress_topics: inProgressTopics,
      completion_percentage: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
    }


    // Find most recent topic for lastAccessed
    const lastAccessed = allProgress.length > 0 ? {
      topicId: allProgress[0].topic_id,
      phase: allProgress[0].phase || 'session'
    } : null

    // Topics already loaded above

    res.json(createSuccessResponse({
      progress: allProgress,
      summary: summary,
      lastAccessed: lastAccessed,
      topics: allTopicsFromCurriculum.map(topic => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        category: topic.category,
        difficulty: topic.difficulty,
        estimatedTime: topic.estimatedTime
      }))
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'get progress')
  }
})

// Debug endpoint to check progress table
router.get('/debug/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId

    // Get progress using the database service
    const data = await getAllProgress(userId)
    const error = null


    res.json({
      success: true,
      debug: {
        userId: userId,
        error: error,
        data: data,
        dataLength: data?.length || 0
      }
    })
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    })
  }
})

// Reset all progress for current user (for testing)
router.delete('/debug/reset-progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId

    // Reset progress - direct database calls for compatibility
    const { getSupabaseClient } = await import('../services/database.js')
    const { progressCache } = await import('../middleware/performance.js')
    const supabase = getSupabaseClient()

    // Delete from all possible tables
    const tables = ['progress', 'chat_sessions']

    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('user_id', userId)

        if (error) {
        } else {
        }
      } catch (err) {
      }
    }

    // Clear cache
    progressCache.clear()

    const result = { success: true, message: 'All progress reset successfully' }

    res.json({
      success: true,
      message: 'All progress data and cache have been reset using centralized progress manager.',
      userId: userId,
      details: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Clear all caches (for debugging)
router.post('/debug/clear-cache', authenticateToken, async (req, res) => {
  try {
    const { progressCache } = await import('../middleware/performance.js')

    progressCache.clear()

    res.json({
      success: true,
      message: 'All backend caches cleared',
      cacheSize: progressCache.size()
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Debug current progress state for a specific topic
router.get('/debug/progress/:topicId', authenticateToken, async (req, res) => {
  try {
    const { topicId } = req.params
    const userId = req.user.userId

    const progress = await getProgress(userId, topicId)


    res.json({
      success: true,
      debug: {
        userId,
        topicId,
        progress,
        nextPhase: null // Simplified for compatibility
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Comprehensive debug - check ALL data sources
router.get('/debug/all-data-sources', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId

    const { getSupabaseClient } = await import('../services/database.js')
    const supabase = getSupabaseClient()

    // Check progress table
    const { data: progressData, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)

    // Check chat_sessions table
    const { data: chatSessionsData, error: chatSessionsError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)

    // Check cache
    const { progressCache } = await import('../middleware/performance.js')


    res.json({
      success: true,
      debug: {
        userId: userId,
        dataSources: {
          progress: {
            count: progressData?.length || 0,
            data: progressData,
            error: progressError?.message
          },
          chatSessions: {
            count: chatSessionsData?.length || 0,
            data: chatSessionsData,
            error: chatSessionsError?.message
          },
          cache: {
            size: progressCache.size()
          }
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

router.get('/continue', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId

    // Get ONLY from progress table - no fallbacks
    const allProgress = await getAllProgress(userId)
    const lastAccessed = allProgress.length > 0 ? allProgress[0] : null

    if (!lastAccessed) {
      // New user: create progress row for first topic so "Continue learning" has a row before they open Learn
      const firstTopic = getAllTopics(courses)[0]
      if (firstTopic) {
        const totalTasks = (firstTopic.tasks || []).length
        await upsertProgress(userId, firstTopic.id, {
          phase: 'session',
          status: 'in_progress',
          current_task: totalTasks > 0 ? 1 : 0,
          total_tasks: totalTasks,
          assignments_completed: 0,
          updated_at: new Date().toISOString()
        })
      }

      const topic = firstTopic || getAllTopics(courses)[0]
      if (!topic) {
        return res.json(createSuccessResponse({ lastAccessed: null }))
      }

      return res.json(createSuccessResponse({
        lastAccessed: {
          topicId: topic.id,
          phase: 'session'
        }
      }))
    }

    const topic = findTopicById(courses, lastAccessed.topic_id)

    res.json(createSuccessResponse({
      lastAccessed: {
        topicId: lastAccessed.topic_id,
        phase: lastAccessed.phase || 'session',
        status: lastAccessed.status || 'not_started'
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'get continue learning')
  }
})

// ============ COURSE MANAGEMENT ============

// GET /courses - Get all courses
router.get('/courses', authenticateToken, async (req, res) => {
  try {
    res.json(createSuccessResponse({
      courses: courses
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'Failed to get courses')
  }
})

// ============ TOPIC MANAGEMENT ============

router.get('/topics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    const topics = getAllTopics(courses)
    const userProgress = await getAllProgress(userId)

    // Enhance topics with progress information
    const enhancedTopics = topics.map(topic => {
      const progress = userProgress.find(p => p.topic_id === topic.id)
      return {
        ...topic,
        status: progress?.status || 'not_started',
        phase: progress?.phase || 'session'
      }
    })

    res.json(createSuccessResponse({
      topics: enhancedTopics,
      totalTopics: topics.length,
      completedTopics: userProgress.filter(p => p.status === 'completed').length
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'get topics')
  }
})

router.get('/topic/:topicId', authenticateToken, requireCourseUnlocked, async (req, res) => {
  try {
    const { topicId } = req.params
    const userId = req.user.userId

    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    let progress = await getProgress(userId, topicId)
    const totalTasks = (topic.tasks || []).length

    // Ensure progress row exists and refresh updated_at and total_tasks when user opens this topic.
    const now = new Date().toISOString()
    if (!progress) {
      progress = await upsertProgress(userId, topicId, {
        phase: 'session',
        status: 'in_progress',
        topic_id: String(topicId),
        current_task: totalTasks > 0 ? 1 : 0,
        total_tasks: totalTasks,
        assignments_completed: 0,
        updated_at: now
      })
    } else {
      // Row exists: refresh updated_at and total_tasks (so 0 never sticks)
      progress = await upsertProgress(userId, topicId, {
        phase: progress.phase || 'session',
        status: progress.status || 'in_progress',
        total_tasks: totalTasks,
        updated_at: now
      })
    }

    // Normalize legacy state: completed + session → assignment + in_progress (2-phase model)
    if (progress?.phase === 'session' && progress?.status === 'completed') {
      await upsertProgress(userId, topicId, {
        phase: 'assignment',
        status: 'in_progress',
        total_tasks: totalTasks,
        updated_at: new Date().toISOString()
      })
      progress = { ...progress, phase: 'assignment', status: 'in_progress' }
    }

    // Get all topics to find next topic
    const allTopics = getAllTopics(courses)
    const currentIndex = allTopics.findIndex(t => t.id === topicId)
    const nextTopic = currentIndex >= 0 && currentIndex < allTopics.length - 1
      ? allTopics[currentIndex + 1]
      : null

    res.json(createSuccessResponse({
      topic: {
        ...topic,
        status: progress?.status || 'not_started',
        phase: progress?.phase || 'session',
        current_task: progress?.current_task ?? 1,
        total_tasks: progress?.total_tasks ?? totalTasks,
        assignments_completed: progress?.assignments_completed ?? 0,
        topic_completed: progress?.status === 'completed' || (totalTasks > 0 && (progress?.assignments_completed ?? 0) >= totalTasks)
      },
      nextTopic: nextTopic
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'get topic details')
  }
})

// ============ DEBUG ENDPOINTS ============

// Debug: List all available topics
router.get('/debug/topics', (req, res) => {
  try {
    const allTopics = courses.flatMap(course =>
      course.topics.map(topic => ({
        id: topic.id,
        title: topic.title,
        courseId: course.id,
        courseTitle: course.title
      }))
    )

    res.json(createSuccessResponse({
      total: allTopics.length,
      topics: allTopics
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'Failed to get topics')
  }
})

// ============ LEGACY COMPATIBILITY ============

// Redirect old subtopic routes to new topic routes
router.get('/state/:topicId/:subtopicId', (req, res) => {
  res.redirect(`/api/learn/state/${req.params.topicId}`)
})

export default router