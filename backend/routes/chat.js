/**
 * Chat Routes - Sara Learning Platform
 * Single-topic chat functionality with enhanced AI interactions
 */

import express from 'express'
import { authenticateToken } from './auth.js'
import { callAI } from '../services/ai.js'
import { getChatHistory, saveChatTurn, saveInitialMessage, clearChatHistory, getChatHistoryString } from '../services/chatService.js'
import { updateChatPhase } from '../services/chatHistory.js'
import { getSupabaseClient } from '../services/database.js'
import { courses } from '../../data/curriculum.js'
import { formatLearningObjectives, findTopicById } from '../utils/curriculum.js'
import { getTopicOrRespond } from '../utils/topicHelper.js'
import { getCompletedTopics, upsertProgress } from '../services/database.js'
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
    completedList,
    variant: 'chat'
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

    console.log(`💬 Session chat: ${userId} -> ${topicId}`)
    // Validate topic exists
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    // Get conversation history and completed topics in parallel
    const [conversationHistory, completedTopics] = await Promise.all([
      getChatHistoryString(userId, topicId),
      getCompletedTopics(userId)
    ])

    // Build embedded prompt with conversation history
    const embeddedPrompt = buildEmbeddedSessionPrompt(topicId, conversationHistory, completedTopics)

    const messages = [
      { role: 'system', content: embeddedPrompt }
    ]

    // Only add user message if it's not empty (for session initialization)
    if (message.trim()) {
      messages.push({ role: 'user', content: message.trim() })
    }

    // Get AI response with optimized parameters for education
    console.log('Calling AI with messages:', messages.length)
    const aiResponse = await callAI(messages, 1500, 0.5, 'llama-3.3-70b-versatile')
    console.log('AI Response received:', {
      type: typeof aiResponse,
      length: aiResponse?.length,
      preview: aiResponse?.substring(0, 100) + '...'
    })

    // Simple and reliable completion detection - look for the exact signal
    let isSessionComplete = aiResponse.includes('SESSION_COMPLETE_SIGNAL')

    // Clean the response by removing the signal (don't show it to user)
    let cleanedResponse = aiResponse.replace('SESSION_COMPLETE_SIGNAL\n\n', '').replace('SESSION_COMPLETE_SIGNAL', '')

    // Fallback: Force completion if conversation is too long (8+ messages) and student has shown console.log usage
    if (!isSessionComplete) {
      const messageCount = conversationHistory.split(/(?=AGENT:|USER:)/).filter(msg => msg.trim()).length
      const hasConsoleLogUsage = conversationHistory.toLowerCase().includes('console.log')

      // Count console.log occurrences in user messages
      const userMessages = conversationHistory.split('USER:').slice(1) // Remove first empty element
      const consoleLogCount = userMessages.filter(msg => msg.toLowerCase().includes('console.log')).length

      if ((messageCount >= 8 && hasConsoleLogUsage) || consoleLogCount >= 3) {
        console.log(`🔄 Forcing session completion - messageCount: ${messageCount}, consoleLogCount: ${consoleLogCount}`)
        isSessionComplete = true
        // Add the completion message that frontend will detect
        cleanedResponse = cleanedResponse + '\n\n🏆 Congratulations! You\'ve mastered console.log! you\'re ready for the playground.'
      }
    }

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
      console.error('Failed to save chat turn')
      return res.status(500).json(createErrorResponse('Failed to save conversation'))
    }

    console.log('🔍 Completion Detection Debug:')
    console.log('   - AI Response length:', aiResponse?.length)
    console.log('   - Contains SESSION_COMPLETE_SIGNAL:', aiResponse.includes('SESSION_COMPLETE_SIGNAL'))
    console.log('   - Is Complete:', isSessionComplete)
    console.log('   - AI Response preview:', aiResponse?.substring(0, 400) + '...')

    // Update progress - direct database call for compatibility
    // 2-phase model: (session <-> play) then (assignment <-> review). Session complete → assignment.
    try {
      if (isSessionComplete) {
        await upsertProgress(userId, topicId, {
          phase: 'assignment',  // Move to assignment phase (session+play combined done)
          status: 'in_progress', // Topic still in progress until assignments done
          updated_at: new Date().toISOString()
        })
        console.log(`🎉 Session completed! User moved to assignment phase for topic: ${topicId}`)
      }
      // If session not complete, progress is already tracked from session start
    } catch (progressError) {
      console.error('❌ Failed to update progress:', progressError)
      console.error('❌ Progress error details:', progressError.message)
      // Don't fail the request if progress update fails
    }

    console.log(`✅ Session chat: User ${userId}, Topic ${topicId}, Topic: "${topic.title}"`)

    // Get updated conversation history
    const updatedConversation = await getChatHistoryString(userId, topicId)
    const messageCount = updatedConversation.split(/(?=AGENT:|USER:)/).filter(msg => msg.trim()).length

    // Debug: Log what we're sending to frontend
    console.log('Sending to frontend:', {
      aiResponse: aiResponse,
      aiResponseType: typeof aiResponse,
      aiResponseLength: aiResponse?.length,
      conversationLength: updatedConversation?.length,
      messageCount,
      conversationPreview: updatedConversation?.substring(0, 150) + '...'
    })

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
      }
    }

    console.log('Response data being sent:', responseData)

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

    console.log(`💡 Assignment hint: ${userId} -> ${topicId}`)

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

    console.log(`✅ Assignment hint: User ${userId}, Topic ${topicId}`)

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

    console.log(`📝 Code feedback: ${userId} -> ${topicId}`)

    // Validate topic exists
    const topic = getTopicOrRespond(res, courses, topicId, createErrorResponse)
    if (!topic) return

    // Build feedback prompt
    const feedbackPrompt = `You are Sara, a JavaScript tutor providing code feedback for "${topic.title}".

Assignment: ${assignment.description}
Student's Code: ${userCode}

Your role:
- Review the student's code carefully
- Check if it meets the assignment requirements
- Provide constructive feedback
- Point out any errors or improvements
- Celebrate what they did well
- Suggest next steps if needed

Guidelines:
- Be encouraging and positive
- Point out specific issues with explanations
- Suggest improvements with examples
- Acknowledge correct parts of their solution
- Help them understand concepts, not just fix syntax

Provide detailed feedback on their code:`

    const messages = [
      { role: 'system', content: feedbackPrompt },
      { role: 'user', content: `Please review my code for the assignment: "${assignment.description}"\n\nMy code:\n${userCode}` }
    ]

    // Get AI response (assignment review only — no phase change)
    const aiResponse = await callAI(messages, 1200, 0.4, 'llama-3.3-70b-versatile')

    console.log(`✅ Code feedback: User ${userId}, Topic ${topicId}`)

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
    const duration = Date.now() - startTime
    console.error(`❌ Chat history retrieval failed after ${duration}ms:`, error.message)
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

    console.log(`🗑️ Chat history cleared: User ${userId}, Topic ${topicId}`)

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

    console.log(`🎯 Manual completion triggered for user ${userId}, topic ${topicId}`)

    // Update progress: session complete → assignment phase (2-phase model)
    await upsertProgress(userId, topicId, {
      status: 'in_progress',
      phase: 'assignment',
      updated_at: new Date().toISOString()
    })

    // Add completion message to chat history
    const completionMessage = `🏆 Congratulations! You've Mastered ${topicId}!\n\nYou have successfully completed all learning objectives. Ready for the next phase!`

    await saveChatTurn(userId, topicId, 'MANUAL_COMPLETION', completionMessage)

    res.json(createSuccessResponse({
      message: 'Session completed successfully',
      phase: 'assignment',
      sessionComplete: true
    }))

  } catch (error) {
    console.error('❌ Manual completion error:', error)
    handleErrorResponse(res, error, 'complete session')
  }
})

export default router