/**
 * Chat Routes - Sara Learning Platform
 * Single-topic chat functionality with enhanced AI interactions
 */

import express from 'express'
import fs from 'fs'
import path from 'path'
import { authenticateToken } from './auth.js'
import { callAI } from '../services/ai.js'
import { getChatHistory, saveChatTurn, saveInitialMessage, clearChatHistory, getChatHistoryString, truncateHistoryForPrompt } from '../services/chatService.js'
import { updateChatPhase } from '../services/chatHistory.js'
import { getSupabaseClient } from '../services/database.js'
import { courses } from '../../data/curriculum.js'
import { formatLearningObjectives, findTopicById, getTopicsTaughtSoFar } from '../utils/curriculum.js'
import { getTopicOrRespond } from '../utils/topicHelper.js'
import { getCompletedTopics, getProgress, upsertProgress } from '../services/database.js'
import progressManager from '../services/progressManager.js'
import { handleErrorResponse, createSuccessResponse, createErrorResponse } from '../utils/responses.js'
import { rateLimitMiddleware } from '../middleware/rateLimiting.js'
import { buildSessionPrompt as buildSessionPromptFromShared } from '../prompts/sessionPrompt.js'

const router = express.Router()

// ============ VALIDATION FUNCTIONS ============
function validateChatRequest(req, res) {
  const { message, topicId } = req.body

  // topicId is always required
  if (!topicId?.trim?.()) {
    res.status(400).json(createErrorResponse('topicId is required'))
    return false
  }

  // message is required but can be empty string for session initialization
  if (message === undefined || message === null) {
    res.status(400).json(createErrorResponse('message is required'))
    return false
  }

  return true
}

// ============ PROMPT BUILDING FUNCTIONS ============

function buildEmbeddedSessionPrompt(topicId, conversationHistory, completedTopics = []) {
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

function buildAssignmentPrompt(topicId, conversationHistory, assignment) {
  const topic = findTopicById(courses, topicId)

  return `You are Sara, a helpful JavaScript tutor providing assignment guidance for "${topic.title}".

Current Assignment: ${assignment.description}

Conversation History:
${conversationHistory || 'Starting assignment help...'}

Your role in ASSIGNMENTS:
- Help students understand the requirements
- Provide hints without giving away the solution
- Debug their code when they're stuck
- Explain concepts they're confused about
- Encourage them to think through problems
- Celebrate their progress

Guidelines:
- Don't give the complete solution immediately
- Ask guiding questions to help them think
- Point out specific issues in their code
- Suggest debugging techniques
- Be patient and encouraging

Respond to their message and help them with the assignment!`
}

// ============ CHAT ENDPOINTS ============

router.post('/session', authenticateToken, rateLimitMiddleware, async (req, res) => {
  try {
    if (!validateChatRequest(req, res)) return

    const { message, topicId } = req.body
    const userId = req.user.userId

    // Validate topic exists
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    // Ensure progress row exists for this topic (e.g. user opened via Next without submitting)
    let progress = await getProgress(userId, topicId)
    if (!progress) {
      await upsertProgress(userId, topicId, {
        phase: 'session',
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      progress = await getProgress(userId, topicId)
    }

    // Block new session messages once topic session is completed (read-only view only). Use 400 so auth interceptor does not redirect to login.
    if (progress && (progress.phase === 'assignment' || progress.topic_completed === true)) {
      return res.status(400).json(createErrorResponse('Session already completed. You can view the conversation but cannot send new messages.', 'SESSION_ALREADY_COMPLETE'))
    }

    // Get conversation history and completed topics in parallel
    const [conversationHistory, completedTopics] = await Promise.all([
      getChatHistoryString(userId, topicId),
      getCompletedTopics(userId)
    ])

    // Include current user message in history so the AI can validate their answer
    const conversationHistoryForPrompt = message.trim()
      ? (conversationHistory ? conversationHistory + '\n' : '') + 'USER: ' + message.trim()
      : conversationHistory

    // Truncate only for the prompt (keep full history in DB and UI)
    const promptHistory = truncateHistoryForPrompt(conversationHistoryForPrompt, 14)

    // Build embedded prompt with conversation history (including current turn)
    const embeddedPrompt = buildEmbeddedSessionPrompt(topicId, promptHistory, completedTopics)

    const messages = [
      { role: 'system', content: embeddedPrompt }
    ]

    // Only add user message if it's not empty (for session initialization)
    if (message.trim()) {
      messages.push({ role: 'user', content: message.trim() })
    }

    // Log finalized system prompt for testing (file + console); skip file on Vercel (read-only fs)
    if (!process.env.VERCEL) {
      const promptLogPath = path.join(process.cwd(), 'logs', 'last-system-prompt.txt')
      try {
        fs.mkdirSync(path.dirname(promptLogPath), { recursive: true })
        fs.writeFileSync(promptLogPath, `[SESSION CHAT] topicId=${topicId} messageLength=${message.trim().length}\n---\n` + embeddedPrompt, 'utf8')
      } catch (e) {
      }
    }
    // Get AI response with optimized parameters for education
    const aiResponse = await callAI(messages, 1500, 0.5, 'llama-3.3-70b-versatile')

    // Completion detection: prompt asks AI to write "Congratulations! You've Mastered [topic]!" when done (no signal)
    const completionPhrases = ['Congratulations', 'You\'ve Mastered', "You've Mastered", 'ready for the playground']
    let isSessionComplete = completionPhrases.some(phrase => aiResponse.includes(phrase))

    let cleanedResponse = aiResponse

    // Save the conversation turn (user message + cleaned AI response) atomically
    let saveSuccess
    if (message.trim()) {
      // Regular conversation turn
      saveSuccess = await saveChatTurn(userId, topicId, message.trim(), cleanedResponse)
    } else {
      // Initial session message
      saveSuccess = await saveInitialMessage(userId, topicId, cleanedResponse)
    }

    if (!saveSuccess) {
      return res.status(500).json(createErrorResponse('Failed to save conversation'))
    }

    // Update progress - direct database call for compatibility
    // 2-phase model: (session <-> play) then (assignment <-> review). Session complete → assignment.
    try {
      if (isSessionComplete) {
        await upsertProgress(userId, topicId, {
          phase: 'assignment',  // Move to assignment phase (session+play combined done)
          status: 'in_progress', // Topic still in progress until assignments done
          updated_at: new Date().toISOString()
        })
      }
      // If session not complete, progress is already tracked from session start
    } catch (progressError) {
      // Don't fail the request if progress update fails
    }

    // Get updated conversation history
    const updatedConversation = await getChatHistoryString(userId, topicId)
    const messageCount = updatedConversation.split(/(?=AGENT:|USER:)/).filter(msg => msg.trim()).length

    const responseData = {
      response: cleanedResponse,
      messageCount: messageCount,
      conversationHistory: updatedConversation,
      phase: 'session', // Always return 'session' for this endpoint
      sessionComplete: isSessionComplete,
      nextPhase: isSessionComplete ? 'assignment' : null, // Indicate what phase comes next
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      },
      // Include finalized system prompt in dev so frontend can log to console
      ...(process.env.NODE_ENV !== 'production' && { debugSystemPrompt: embeddedPrompt })
    }

    res.json(createSuccessResponse(responseData))
  } catch (error) {
    handleErrorResponse(res, error, 'session chat')
  }
})

router.post('/assignment/hint', authenticateToken, rateLimitMiddleware, async (req, res) => {
  try {
    const { topicId, assignment, userCode } = req.body
    const userId = req.user.userId

    if (!topicId || !assignment) {
      return res.status(400).json(createErrorResponse('topicId and assignment are required'))
    }


    // Validate topic exists
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    // Get conversation history for assignment context
    const conversationHistory = await getChatHistoryString(userId, topicId)

    // Build assignment prompt
    const embeddedPrompt = buildAssignmentPrompt(topicId, conversationHistory, assignment)

    const userMessage = userCode
      ? `I'm working on this assignment: "${assignment.description}". Here's my code: ${userCode}. Can you give me a hint?`
      : `I'm stuck on this assignment: "${assignment.description}". Can you give me a hint?`

    const messages = [
      { role: 'system', content: embeddedPrompt },
      { role: 'user', content: userMessage }
    ]

    // Get AI response
    const aiResponse = await callAI(messages, 1000, 0.4, 'llama-3.3-70b-versatile')

    // Update chat phase to assignment
    await updateChatPhase(userId, topicId, 'assignment')


    res.json(createSuccessResponse({
      hint: aiResponse,
      phase: 'assignment',
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'assignment hint')
  }
})

router.post('/feedback', authenticateToken, rateLimitMiddleware, async (req, res) => {
  try {
    const { topicId, userCode, assignment } = req.body
    const userId = req.user.userId

    if (!topicId || !userCode || !assignment) {
      return res.status(400).json(createErrorResponse('topicId, userCode, and assignment are required'))
    }


    // Validate topic exists
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    const topicsTaughtSoFar = getTopicsTaughtSoFar(courses, topicId)
    const conceptsScope = topicsTaughtSoFar.length > 0
      ? topicsTaughtSoFar.join(' → ')
      : topic.title

    // Build feedback prompt: experienced developer writes best solution using only concepts taught so far
    const feedbackPrompt = `You are an experienced JavaScript developer creating a reference solution for a student assignment.

CONCEPTS CONSTRAINT (CRITICAL)
The student has completed these topics in order: ${conceptsScope}
Your solution must ONLY use concepts from this list. Do not use any feature, 
pattern, or syntax from topics that come later in the curriculum.

ASSIGNMENT
${assignment.description}

STUDENT'S CURRENT CODE (to understand their approach)
${userCode}

REQUIREMENTS
Write a clear, correct solution that:
- Solves the assignment completely
- Uses only concepts from the allowed list above
- Demonstrates good practices within those constraints
- Uses readable variable names and clear structure
- Includes any starter code specified in the assignment description

OUTPUT FORMAT
1. First, a short "Differences" section: a bullet list comparing the student's code to your solution. For each point, state what is wrong or missing in their code (or what they did differently from good practice). Use plain language so the student can see exactly where they lag behind developer-style code.
2. Then a blank line, then a single fenced JavaScript code block with your solution (e.g. \`\`\`javascript ... \`\`\`).
`

    const messages = [
      { role: 'system', content: feedbackPrompt },
      { role: 'user', content: `Write the best solution for this assignment using only the concepts taught so far. First output a short "Differences" bullet list comparing the student's code to your solution, then output your solution in a single fenced JavaScript code block.` }
    ]

    // Get AI response (differences list + reference code)
    const aiResponse = await callAI(messages, 1500, 0.3, 'llama-3.3-70b-versatile')

    res.json(createSuccessResponse({
      feedback: aiResponse,
      phase: 'assignment',
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'code feedback')
  }
})

// ============ CHAT HISTORY MANAGEMENT ============

// Debug: Get raw chat history from database
router.get('/debug/history/:topicId', authenticateToken, async (req, res) => {
  try {
    const { topicId } = req.params
    const userId = req.user.userId

    // Get raw data from database
    const { data, error } = await getSupabaseClient()
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    res.json(createSuccessResponse({
      raw_data: data,
      messages_type: typeof data?.messages,
      messages_content: data?.messages
    }))

  } catch (error) {
    handleErrorResponse(res, error, 'get debug history')
  }
})

router.get('/history/:topicId', authenticateToken, async (req, res) => {
  const startTime = Date.now()

  try {
    const { topicId } = req.params
    const userId = req.user.userId

    // Validate topic exists
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    const messages = await getChatHistory(userId, topicId)
    const duration = Date.now() - startTime

    // Add performance metrics to response
    res.json(createSuccessResponse({
      messages: messages,
      messageCount: messages.length,
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      },
      performance: {
        retrievalTime: duration,
        cached: duration < 100 // Likely cached if very fast
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'get chat history')
  }
})

// Cache statistics endpoint
router.get('/cache/stats', authenticateToken, async (req, res) => {
  try {
    const { getCacheStats } = await import('../services/chatCache.js')
    const stats = await getCacheStats()

    res.json(createSuccessResponse({
      cache: stats,
      timestamp: new Date().toISOString()
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'get cache stats')
  }
})

router.delete('/history/:topicId', authenticateToken, async (req, res) => {
  try {
    const { topicId } = req.params
    const userId = req.user.userId

    // Validate topic exists
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    await clearChatHistory(userId, topicId)


    res.json(createSuccessResponse({
      message: 'Chat history cleared successfully',
      topic: {
        id: topicId,
        title: topic.title,
        category: topic.category
      }
    }))
  } catch (error) {
    handleErrorResponse(res, error, 'clear chat history')
  }
})

// ============ LEGACY COMPATIBILITY ============

// Legacy routes removed - using single-topic architecture

router.delete('/history/:topicId/:subtopicId', (req, res) => {
  res.redirect(307, `/api/chat/history/${req.params.topicId}`)
})

// Manual completion endpoint for testing
router.post('/complete/:topicId', authenticateToken, async (req, res) => {
  try {
    const { topicId } = req.params
    const userId = req.user.userId

    // Update progress: session complete → assignment phase (2-phase model)
    await upsertProgress(userId, topicId, {
      status: 'in_progress',
      phase: 'assignment',
      updated_at: new Date().toISOString()
    })

    // Add completion message to chat history
    const completionMessage = `Congratulations! You've Mastered ${topicId}!\n\nYou have successfully completed all learning objectives. Ready for the next phase!`

    await saveChatTurn(userId, topicId, 'MANUAL_COMPLETION', completionMessage)

    res.json(createSuccessResponse({
      message: 'Session completed successfully',
      phase: 'assignment',
      sessionComplete: true
    }))

  } catch (error) {
    handleErrorResponse(res, error, 'complete session')
  }
})

export default router