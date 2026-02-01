/**
 * Learning Routes - Sara Learning Platform
 * Single-topic architecture with enhanced features
 */

import express from 'express'
import { authenticateToken } from './auth.js'
import { callAI } from '../services/ai.js'
import {
  getProgress,
  upsertProgress,
  getAllProgress,
  getLastAccessedTopic,
  getCompletedTopics,
  getUserProgressSummary
} from '../services/database.js'
import { saveChatTurn, saveInitialMessage, clearChatHistory, getChatHistoryString, getChatMessages } from '../services/chatHistory.js'
import { courses } from '../../data/curriculum.js'
import { formatLearningObjectives, findTopicById, getAllTopics } from '../utils/curriculum.js'
import { handleErrorResponse, createSuccessResponse, createErrorResponse } from '../utils/responses.js'
import { rateLimitMiddleware } from '../middleware/rateLimiting.js'

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

function buildSessionPrompt(topicId, conversationHistory, completedTopics = []) {
  const topic = findTopicById(courses, topicId)
  if (!topic) {
    throw new Error(`Topic not found: ${topicId}`)
  }

  const goals = formatLearningObjectives(topic.outcomes)
  const completedList = completedTopics.length > 0
    ? `\n\nCompleted Topics: ${completedTopics.join(', ')}`
    : ''

  return `You are Sara, a friendly JavaScript tutor teaching "${topic.title}".

Goals to Cover:
${goals}

Conversation History:
${conversationHistory || 'Starting new conversation...'}${completedList}

Required Response Format:
For each new concept:
1. One sentence: what it does (explain as simple as you can)
2. "Here's an example:" + minimal code example  
3. "Your turn!" + specific practice task
4. STOP

After student responds:
1. Celebrate if correct (🎉)
2. Use their code to teach when natural, otherwise just move forward
3. Introduce next goal

Response rules:
- 3-4 short paragraphs max
- Conversational, friendly tone
- Use meaningful variable names (userName, not x)
- Always end with a question
- NEVER continue past "Your turn!" - wait for them
- Use "terminal" instead of "browser console"

Adaptive Behaviors:
- If student asks "What is X?": Explain immediately, then return to lesson
- If wrong: Point out issue gently + why + hint (not answer) + ask retry
- If stuck after 2 tries: Give more explicit guidance

Progress & Ending:
- Before each response, check what's already covered in conversation_history
- What's next in goals?
- Has current concept been practiced AND confirmed?
- End when ALL goals are: Explained ✅ + Practiced ✅ + Confirmed ✅

Then write:
🏆 Congratulations! You've Mastered ${topic.title}!
Recap: [list key points]
STOP. No bonus content.

Generate the response now.`
}

async function getCompletedTopicsForUser(userId) {
  try {
    const completedTopics = await getCompletedTopics(userId)
    return completedTopics
  } catch (error) {
    console.error('Error getting completed topics:', error)
    return []
  }
}

// ============ LEARNING STATE MANAGEMENT ============

router.get('/state/:topicId', authenticateToken, async (req, res) => {
  try {
    const { topicId } = req.params
    const userId = req.user.userId

    console.log(`🔄 Loading learning state for: ${topicId}`)

    // Validate topic exists
    const topic = findTopicById(courses, topicId)
    if (!topic) {
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    // Get progress and chat history in parallel
    const [progress, chatHistory] = await Promise.all([
      getProgress(userId, topicId),
      getChatHistoryString(userId, topicId)
    ])

    console.log(`📊 Progress data:`, {
      hasProgress: !!progress,
      status: progress?.status,
      phase: progress?.phase,
      chatHistoryLength: chatHistory?.length
    })

    if (!progress) {
      console.log(`📝 No progress found for ${topicId}`)
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
      conceptRevealed: progress.concept_revealed || false,
      currentAssignment: progress.current_task || 0,
      totalAssignments: progress.total_tasks || 0,
      status: progress.status,
      conversationHistory: chatHistory || '',
      assignments: [],
      savedCode: progress?.saved_code || '',
      hintsUsed: progress?.hints_used || 0,
      topic: {
        id: topicId,
        title: topic.title,
        description: topic.description,
        category: topic.category,
        difficulty: topic.difficulty,
        estimatedTime: topic.estimatedTime
      }
    }

    console.log(`📤 Sending response:`, {
      exists: responseData.exists,
      conversationHistoryLength: responseData.conversationHistory?.length,
      phase: responseData.phase
    })

    res.json(responseData)
  } catch (error) {
    handleErrorResponse(res, error, 'get session state')
  }
})

// ============ SESSION PHASE ============

router.post('/session/start', authenticateToken, rateLimitMiddleware, validateBody(schemas.sessionStart), async (req, res) => {
  try {
    const { topicId, assignments } = req.body
    const userId = req.user.userId

    console.log(`🚀 Starting session for topic: ${topicId}`)

    // Validate topic exists
    const topic = findTopicById(courses, topicId)
    if (!topic) {
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    // Handle empty assignments
    const taskList = assignments && assignments.length > 0
      ? assignments
      : ['Practice the concept with a simple example']

    // Update progress
    await upsertProgress(userId, topicId, {
      phase: 'session',
      concept_revealed: false,
      current_task: 0,
      current_outcome_index: 0,
      total_tasks: taskList.length,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      completed_at: null
    })

    // Get student context and build prompt
    const completedTopics = await getCompletedTopicsForUser(userId)
    const outcomes = topic ? formatLearningObjectives(topic.outcomes) : 'Learn programming concepts'

    // Build the session prompt
    const sessionPrompt = buildSessionPrompt(topicId, '', completedTopics)

    const messages = [
      { role: 'system', content: sessionPrompt },
      { role: 'user', content: `Start teaching the first concept.` }
    ]

    // Generate initial message (idempotent - won't duplicate if conversation exists)
    const aiResponse = await callAI(messages, 800, 0.4, 'llama-3.3-70b-versatile')

    const result = await saveInitialMessage(userId, topicId, aiResponse)

    const directResponse = result.wasCreated ? aiResponse :
      result.conversationHistory.match(/AGENT: (.+?)(?=\nUSER:|$)/s)?.[1]?.trim() || 'Session ready'

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

router.post('/playtime/start', authenticateToken, rateLimitMiddleware, validateBody(schemas.playtimeStart), async (req, res) => {
  try {
    const { topicId } = req.body
    const userId = req.user.userId

    console.log(`🎮 Starting playtime for topic: ${topicId}`)

    // Validate topic exists
    const topic = findTopicById(courses, topicId)
    if (!topic) {
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    // Update progress to playtime phase
    await upsertProgress(userId, topicId, {
      phase: 'playtime',
      status: 'in_progress'
    })

    // Build playtime prompt
    const outcomes = topic ? formatLearningObjectives(topic.outcomes) : 'Learn programming concepts'
    const completedTopics = await getCompletedTopicsForUser(userId)

    const playtimePrompt = `You are Sara, a creative JavaScript mentor for "${topic?.title || 'JavaScript'}" playtime!

Student has learned: ${outcomes}
Completed topics: ${completedTopics.join(', ') || 'None yet'}

Your role in PLAYTIME:
- Suggest 3-4 fun, creative coding challenges using ${topic.title}
- Make challenges progressively more interesting
- Encourage experimentation and creativity
- Be supportive and enthusiastic
- Help debug when they get stuck

Challenge ideas should be:
- Fun and engaging (games, art, interactive)
- Use the concepts they just learned
- Build on each other
- Appropriate for their level

Start by suggesting the first creative challenge!`

    const messages = [
      { role: 'system', content: playtimePrompt },
      { role: 'user', content: `I'm ready for some creative coding challenges with ${topic.title}!` }
    ]

    const aiResponse = await callAI(messages, 1000, 0.6, 'llama-3.3-70b-versatile')

    res.json(createSuccessResponse({
      message: aiResponse,
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

// ============ ASSIGNMENT PHASE ============

router.post('/assignment/start', authenticateToken, rateLimitMiddleware, validateBody(schemas.assignmentStart), async (req, res) => {
  try {
    const { topicId } = req.body
    const userId = req.user.userId

    console.log(`📝 Starting assignment for topic: ${topicId}`)

    // Validate topic exists
    const topic = findTopicById(courses, topicId)
    if (!topic) {
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    // Get topic tasks
    const tasks = topic.tasks || []
    if (tasks.length === 0) {
      return res.status(400).json(createErrorResponse('No assignments available for this topic'))
    }

    // Update progress to assignment phase
    await upsertProgress(userId, topicId, {
      phase: 'assignment',
      status: 'in_progress',
      total_tasks: tasks.length,
      current_task: 0
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

// ============ PROGRESS MANAGEMENT ============

router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    console.log(`📊 Progress API called for user: ${userId}`)

    // Try to get progress from database service
    let progressFromTable = []
    try {
      progressFromTable = await getAllProgress(userId)
      console.log(`📊 Found ${progressFromTable?.length || 0} progress records from table`)
    } catch (error) {
      console.error('❌ Progress query error:', error)
    }

    // Also try to get chat sessions as fallback
    let chatSessions = []
    try {
      const { getSupabaseClient } = await import('../services/supabase.js')
      const supabase = getSupabaseClient()
      
      // Try chat_sessions first, then chat_history
      let result = await supabase
        .from('chat_sessions')
        .select('topic_id, phase, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
      
      if (result.error) {
        console.log('📭 Trying chat_history table...')
        result = await supabase
          .from('chat_history')
          .select('topic_id, phase, updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
      }
      
      chatSessions = result.data || []
      console.log(`📊 Found ${chatSessions.length} chat sessions`)
    } catch (error) {
      console.error('❌ Chat sessions query error:', error)
    }

    // Convert chat sessions to progress format
    const progressFromChat = (chatSessions || []).map(session => ({
      topic_id: session.topic_id,
      status: 'in_progress',
      phase: session.phase || 'session',
      updated_at: session.updated_at
    }))

    console.log(`📊 Progress from chat sessions: ${progressFromChat.length} records`)

    // Combine both sources, prioritizing progress table if it exists
    const allProgress = progressFromTable.length > 0 ? progressFromTable : progressFromChat

    // Find most recent topic for lastAccessed
    const lastAccessed = allProgress.length > 0 ? {
      topicId: allProgress[0].topic_id,
      phase: allProgress[0].phase || 'session'
    } : null

    console.log(`📊 Final progress results: ${allProgress.length} records`)
    console.log(`📊 Last accessed:`, lastAccessed)

    res.json(createSuccessResponse({
      progress: allProgress,
      summary: {
        total_topics: 45, // From curriculum
        completed_topics: 0, // We'll calculate this later
        in_progress_topics: allProgress.length
      },
      lastAccessed: lastAccessed,
      topics: getAllTopics(courses).map(topic => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        category: topic.category,
        difficulty: topic.difficulty,
        estimatedTime: topic.estimatedTime
      }))
    }))
  } catch (error) {
    console.error('❌ Progress API error:', error)
    console.error('❌ Error details:', error.message)
    handleErrorResponse(res, error, 'get progress')
  }
})

// Debug endpoint to check progress table
router.get('/debug/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId
    console.log(`🔍 Debug: Checking progress table for user ${userId}`)

    // Get progress using the database service
    const data = await getAllProgress(userId)
    const error = null

    console.log(`🔍 Debug results:`)
    console.log(`   - Error:`, error)
    console.log(`   - Data:`, data)
    console.log(`   - Data length:`, data?.length)

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
    console.error('❌ Debug error:', error)
    res.json({
      success: false,
      error: error.message
    })
  }
})

router.get('/continue', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId

    const lastAccessed = await getLastAccessedTopic(userId)

    if (!lastAccessed) {
      // If no progress, start with first topic
      const firstTopic = getAllTopics(courses)[0]
      return res.json(createSuccessResponse({
        topicId: firstTopic.id,
        phase: 'session',
        isNew: true,
        topic: {
          id: firstTopic.id,
          title: firstTopic.title,
          description: firstTopic.description,
          category: firstTopic.category
        }
      }))
    }

    const topic = findTopicById(courses, lastAccessed.topic_id)

    res.json(createSuccessResponse({
      topicId: lastAccessed.topic_id,
      phase: lastAccessed.phase,
      isNew: false,
      lastAccessed: lastAccessed.last_accessed,
      topic: topic ? {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        category: topic.category
      } : null
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
    console.error('Get courses error:', error)
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
        phase: progress?.phase || 'session',
        lastAccessed: progress?.last_accessed,
        completedAt: progress?.completed_at
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

router.get('/topic/:topicId', authenticateToken, async (req, res) => {
  try {
    const { topicId } = req.params
    const userId = req.user.userId

    const topic = findTopicById(courses, topicId)
    if (!topic) {
      return res.status(404).json(createErrorResponse('Topic not found'))
    }

    const progress = await getProgress(userId, topicId)

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
        lastAccessed: progress?.last_accessed,
        completedAt: progress?.completed_at
      },
      nextTopic: nextTopic
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'get topic details')
  }
})

// ============ LEGACY COMPATIBILITY ============

// Redirect old subtopic routes to new topic routes
router.get('/state/:topicId/:subtopicId', (req, res) => {
  res.redirect(`/api/learn/state/${req.params.topicId}`)
})

export default router