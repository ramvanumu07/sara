import express from 'express'
import axios from 'axios'
import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  getTaskProgress,
  saveTaskProgress,
  saveChatHistory,
  getChatHistory,
  getPhase,
  setPhase,
  getAssignmentCount,
  incrementAssignmentCount,
  resetPhaseState,
  getSubtopicState
} from '../services/taskDb.js'

const router = express.Router()
const __dirname = dirname(fileURLToPath(import.meta.url))

// Cache for prompt files
let learningPrompt = null
let assignmentPrompt = null

// Load prompt files
async function loadPrompts() {
  if (!learningPrompt) {
    try {
      learningPrompt = await readFile(join(__dirname, '../../learning-phase-prompt.txt'), 'utf-8')
    } catch (error) {
      console.error('Failed to load learning prompt:', error.message)
      learningPrompt = getDefaultLearningPrompt()
    }
  }

  if (!assignmentPrompt) {
    try {
      assignmentPrompt = await readFile(join(__dirname, '../../assignment-phase-prompt.txt'), 'utf-8')
    } catch (error) {
      console.error('Failed to load assignment prompt:', error.message)
      assignmentPrompt = getDefaultAssignmentPrompt()
    }
  }

  return { learningPrompt, assignmentPrompt }
}

// Default prompts (fallback)
function getDefaultLearningPrompt() {
  return `You are a JavaScript mentor in LEARNING PHASE. Teach through questions, not lectures. 
Ask one thought-provoking question at a time. Let the student discover concepts.
When all concepts are covered, include LEARNING_PHASE_COMPLETE in your response.`
}

function getDefaultAssignmentPrompt() {
  return `You are a JavaScript mentor in ASSIGNMENT PHASE. Give coding assignments and review code strictly.
Focus on code quality: naming, const vs let, no global scope, readability.
When an assignment is done well, include ASSIGNMENT_COMPLETE.
After 3-5 quality assignments, include SUBTOPIC_COMPLETE.`
}

// Get context for the current subtopic
function getSubtopicContext(topicId, subtopicId, subtopicTitle, phase, assignmentCount) {
  return `
═══════════════════════════════════════════════════════════════
CURRENT CONTEXT
═══════════════════════════════════════════════════════════════
Topic: ${topicId}
Subtopic: ${subtopicId}
Subtopic Title: ${subtopicTitle || subtopicId}
Current Phase: ${phase.toUpperCase()}
${phase === 'assignment' ? `Assignments Completed: ${assignmentCount.completed}` : ''}

Remember: Stay focused on this specific subtopic. Don't jump to other topics.
`
}

// POST /api/chat - Main chat endpoint
router.post('/', async (req, res) => {
  try {
    const {
      studentId, topicId, subtopicId, message, action, history,
      // New flexible context format
      concepts, prerequisites, teachingGoal,
      // Legacy format (still supported)
      learningPoints,
      tasks,
      subtopicTitle
    } = req.body

    // Build subtopic context object (supports both new and legacy formats)
    const subtopicContext = {
      concepts: concepts || [],
      prerequisites: prerequisites || [],
      teachingGoal: teachingGoal || '',
      learningPoints: learningPoints || [],
      tasks: tasks || []
    }

    // Load prompts
    await loadPrompts()

    // Get current phase and assignment state
    const state = await getSubtopicState(studentId, topicId, subtopicId)
    let currentPhase = state.phase
    let assignmentCount = state.assignments

    // Handle lesson start
    if (action === 'start_lesson') {
      // Reset everything for fresh start
      await resetPhaseState(studentId, topicId, subtopicId)
      currentPhase = 'learning'
      assignmentCount = { completed: 0, total: 0 }

      // Clear chat history
      await saveChatHistory(studentId, topicId, subtopicId, [])

      const welcomeMessage = await generateAIResponse(
        studentId,
        topicId,
        subtopicId,
        [],
        'START_LESSON',
        currentPhase,
        assignmentCount,
        subtopicContext,
        subtopicTitle
      )

      return res.json({
        success: true,
        message: welcomeMessage,
        phase: currentPhase,
        assignmentCount
      })
    }

    // Handle regular chat message
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      })
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(
      studentId,
      topicId,
      subtopicId,
      history || [],
      message,
      currentPhase,
      assignmentCount,
      subtopicContext,
      subtopicTitle
    )

    // Process response for phase transitions and markers
    let responseMessage = aiResponse
    let phaseChanged = false
    let subtopicComplete = false

    // Check for LEARNING_PHASE_COMPLETE - transition to assignment phase
    if (aiResponse.includes('LEARNING_PHASE_COMPLETE')) {
      responseMessage = aiResponse.replace(/LEARNING_PHASE_COMPLETE/gi, '').trim()
      currentPhase = 'assignment'
      await setPhase(studentId, topicId, subtopicId, 'assignment')
      phaseChanged = true
    }

    // Check for ASSIGNMENT_COMPLETE - increment assignment count
    if (aiResponse.includes('ASSIGNMENT_COMPLETE')) {
      responseMessage = responseMessage.replace(/ASSIGNMENT_COMPLETE/gi, '').trim()
      assignmentCount = await incrementAssignmentCount(studentId, topicId, subtopicId)
    }

    // Check for SUBTOPIC_COMPLETE - subtopic fully mastered
    if (aiResponse.includes('SUBTOPIC_COMPLETE')) {
      responseMessage = responseMessage.replace(/SUBTOPIC_COMPLETE/gi, '').trim()
      subtopicComplete = true
    }

    // Save chat history
    const updatedHistory = [
      ...(history || []),
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: responseMessage, timestamp: new Date().toISOString() }
    ]
    await saveChatHistory(studentId, topicId, subtopicId, updatedHistory)

    res.json({
      success: true,
      message: responseMessage,
      phase: currentPhase,
      phaseChanged,
      assignmentCount,
      subtopicComplete
    })

  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message'
    })
  }
})

// GET /api/chat/history/:studentId/:topicId/:subtopicId
router.get('/history/:studentId/:topicId/:subtopicId', async (req, res) => {
  try {
    const { studentId, topicId, subtopicId } = req.params

    const history = await getChatHistory(studentId, topicId, subtopicId)
    const state = await getSubtopicState(studentId, topicId, subtopicId)

    res.json({
      success: true,
      history: history || [],
      phase: state.phase,
      assignmentCount: state.assignments
    })

  } catch (error) {
    console.error('Get history error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history'
    })
  }
})

// Generate AI response using Groq
async function generateAIResponse(studentId, topicId, subtopicId, history, userMessage, phase, assignmentCount, subtopicContext = {}, subtopicTitle = '') {
  const GROQ_API_KEY = process.env.GROQ_API_KEY

  // Extract context (supports both new format and legacy learningPoints)
  const { concepts, prerequisites, teachingGoal, learningPoints, tasks } = subtopicContext

  // If no API key, return a helpful fallback message
  if (!GROQ_API_KEY) {
    return `The AI tutor isn't configured yet. Please add your GROQ_API_KEY to the .env file.

**To enable AI tutoring:**
1. Get a free API key from https://console.groq.com
2. Add it to your backend/.env file as GROQ_API_KEY`
  }

  try {
    // Select the appropriate system prompt based on phase
    const systemPrompt = phase === 'learning' ? learningPrompt : assignmentPrompt
    const context = getSubtopicContext(topicId, subtopicId, subtopicTitle, phase, assignmentCount)

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: context }
    ]

    // Add learning context for learning phase - PRINCIPLES, NOT PROCEDURES
    if (phase === 'learning') {
      let learningContext = `
【 TEACHING CONTEXT - NOT A SCRIPT 】
Subtopic: ${subtopicTitle || subtopicId}`

      if (concepts && concepts.length > 0) {
        learningContext += `

Key concepts to cover: ${concepts.join(', ')}`
      } else if (learningPoints && learningPoints.length > 0) {
        // Legacy format fallback
        learningContext += `

Key concepts to cover: ${learningPoints.join(', ')}`
      }

      if (prerequisites && prerequisites.length > 0) {
        learningContext += `

Prerequisites they should know: ${prerequisites.join(', ')}`
      }

      if (teachingGoal) {
        learningContext += `

Teaching goal: ${teachingGoal}`
      }

      learningContext += `

Remember: This is guidance, not a script. The number of questions depends on how the user responds.
Adapt your approach based on their understanding. Read the room.`

      messages.push({ role: 'system', content: learningContext })
    }

    // Add tasks context for assignment phase
    if (phase === 'assignment' && tasks && tasks.length > 0) {
      messages.push({
        role: 'system',
        content: `
【 AVAILABLE ASSIGNMENTS FOR THIS SUBTOPIC 】
${tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Give assignments based on these. You can modify or expand on them. Focus on code quality review.`
      })
    }

    // Add conversation history
    if (history && history.length > 0) {
      history.forEach(msg => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.content })
        }
      })
    }

    // Add current message
    if (userMessage === 'START_LESSON') {
      if (phase === 'learning') {
        messages.push({
          role: 'user',
          content: `I want to learn about "${subtopicTitle || subtopicId}". Let's start the learning session.`
        })
      } else {
        messages.push({
          role: 'user',
          content: `I'm ready for assignments on "${subtopicTitle || subtopicId}". Give me my first challenge.`
        })
      }
    } else {
      messages.push({ role: 'user', content: userMessage })
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return response.data.choices[0]?.message?.content || 'I had trouble generating a response. Please try again.'

  } catch (error) {
    console.error('Groq API error:', error.response?.data || error.message)

    return `I'm having trouble connecting to the AI service right now. Please try again in a moment.`
  }
}

export default router
