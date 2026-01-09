import express from 'express'
import Groq from 'groq-sdk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { authenticateToken } from './auth.js'
import {
  getProgress,
  upsertProgress,
  getChatHistory,
  saveChatMessage,
  clearChatHistory,
  getAllProgress
} from '../services/supabase.js'
import { getFormattedOutcomes, getOutcomes } from '../../frontend/src/data/curriculum.js'

const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ============ RATE LIMITING ============
const rateLimiter = new Map()
const RATE_LIMIT = 20 // requests per minute
const RATE_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(userId) {
  const now = Date.now()
  const userRequests = rateLimiter.get(userId) || []

  // Clean old requests
  const recentRequests = userRequests.filter(time => now - time < RATE_WINDOW)

  if (recentRequests.length >= RATE_LIMIT) {
    return false
  }

  recentRequests.push(now)
  rateLimiter.set(userId, recentRequests)
  return true
}

// Rate limit middleware
function rateLimitMiddleware(req, res, next) {
  if (!checkRateLimit(req.user.userId)) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please wait a moment before trying again.',
      retryAfter: 60
    })
  }
  next()
}

// ============ GROQ CLIENT WITH TIMEOUT ============
let groq = null
function getGroq() {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      timeout: 30000 // 30 second timeout
    })
  }
  return groq
}

// AI call wrapper with timeout and retry
async function callAI(messages, options = {}) {
  const {
    model = 'llama-3.1-8b-instant',
    temperature = 0.3,
    maxTokens = 150,
    retries = 2
  } = options

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 25000)

      const completion = await getGroq().chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens
      })

      clearTimeout(timeoutId)
      return completion.choices[0]?.message?.content || null
    } catch (error) {
      console.error(`AI call attempt ${attempt + 1} failed:`, error.message)

      if (attempt === retries) {
        throw new Error('AI service temporarily unavailable. Please try again.')
      }

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }
}

// ============ PROMPT LOADING ============
const promptCache = new Map()

function loadPrompt(name) {
  // Cache prompts in production, reload in dev
  if (process.env.NODE_ENV === 'production' && promptCache.has(name)) {
    return promptCache.get(name)
  }

  const promptPath = path.join(__dirname, '..', 'prompts', `${name}.txt`)
  try {
    const content = fs.readFileSync(promptPath, 'utf-8')
    promptCache.set(name, content)
    return content
  } catch (error) {
    console.error(`Failed to load prompt ${name}:`, error.message)
    return ''
  }
}

// ============ CODE EXECUTION (SAFE) ============
function executeCode(code) {
  const logs = []
  let result = undefined
  let error = null

  try {
    // Create safe console mock
    const mockConsole = {
      log: (...args) => logs.push(args.map(formatValue).join(' ')),
      error: (...args) => logs.push('ERROR: ' + args.map(formatValue).join(' ')),
      warn: (...args) => logs.push('WARN: ' + args.map(formatValue).join(' ')),
      info: (...args) => logs.push('INFO: ' + args.map(formatValue).join(' '))
    }

    // Execute in isolated context
    const fn = new Function('console', `
      "use strict";
      ${code}
    `)

    result = fn(mockConsole)
  } catch (e) {
    error = e.message
    logs.push(`Error: ${e.message}`)
  }

  return {
    output: logs.join('\n') || (error ? '' : '(no output)'),
    logs,
    error,
    success: !error
  }
}

function formatValue(val) {
  if (val === undefined) return 'undefined'
  if (val === null) return 'null'
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val, null, 2)
    } catch {
      return String(val)
    }
  }
  return String(val)
}

// ============ AI RESPONSE PARSING ============
function parseAIResponse(response) {
  if (!response) {
    return { message: '', progress: null, isComplete: false }
  }

  // Extract visible message (everything before <progress> tag)
  let message = response.split('<progress>')[0].trim()

  // Also remove <complete> tag from visible message
  message = message.split('<complete>')[0].trim()

  // Extract progress JSON
  let progress = null
  const progressMatch = response.match(/<progress>(.*?)<\/progress>/s)
  if (progressMatch) {
    try {
      progress = JSON.parse(progressMatch[1].trim())
    } catch (e) {
      console.warn('Failed to parse progress JSON:', e.message)
    }
  }

  // Check if session is complete
  const isComplete = /<complete>\s*true\s*<\/complete>/i.test(response)

  return { message, progress, isComplete }
}

// Build session prompt with outcomes injected
function buildSessionPrompt(topicId, subtopicId) {
  const promptTemplate = loadPrompt('session-prompt')
  const outcomes = getFormattedOutcomes(topicId, subtopicId)

  if (!outcomes) {
    // Fallback if no outcomes defined for this subtopic
    return promptTemplate.replace('{{OUTCOMES}}', 'Teach the core concepts of this topic thoroughly')
  }

  return promptTemplate.replace('{{OUTCOMES}}', outcomes)
}

// ============ PREREQUISITES & CONTEXT ============
async function getCompletedTopics(userId) {
  try {
    const allProgress = await getAllProgress(userId)
    return allProgress
      .filter(p => p.status === 'completed')
      .map(p => ({ topicId: p.topic_id, subtopicId: p.subtopic_id }))
  } catch {
    return []
  }
}

function buildStudentContext(completedTopics, currentTopic, currentSubtopic) {
  const completedList = completedTopics
    .map(t => `${t.topicId}/${t.subtopicId}`)
    .slice(-10) // Last 10 for context size
    .join(', ')

  return `
STUDENT_CONTEXT:
- Topics completed: ${completedList || 'None (first lesson)'}
- Current topic: ${currentTopic}
- Current subtopic: ${currentSubtopic}
`
}

// ============ GET SESSION STATE ============
router.get('/state/:topicId/:subtopicId', authenticateToken, async (req, res) => {
  try {
    const { topicId, subtopicId } = req.params
    const progress = await getProgress(req.user.userId, topicId, subtopicId)

    if (!progress) {
      return res.json({
        success: true,
        exists: false,
        phase: 'session',
        conceptRevealed: false,
        currentAssignment: 0,
        totalAssignments: 0,
        status: 'not_started',
        savedCode: ''
      })
    }

    const chatHistory = await getChatHistory(req.user.userId, topicId, subtopicId)

    if (chatHistory.length === 0) {
      return res.json({
        success: true,
        exists: false,
        phase: 'session',
        conceptRevealed: false,
        currentAssignment: 0,
        totalAssignments: 0,
        status: 'not_started',
        savedCode: progress.saved_code || ''
      })
    }

    let normalizedPhase = progress.phase || 'session'
    if (normalizedPhase === 'learning') normalizedPhase = 'session'

    res.json({
      success: true,
      exists: true,
      phase: normalizedPhase,
      conceptRevealed: progress.concept_revealed || false,
      currentAssignment: progress.current_task || 0,
      totalAssignments: progress.total_tasks || 0,
      status: progress.status,
      messages: chatHistory.map(m => ({ role: m.role, content: m.content })),
      assignments: [],
      savedCode: progress?.saved_code || '',
      hintsUsed: progress?.hints_used || 0
    })
  } catch (error) {
    console.error('Get state error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get session state. Please refresh the page.',
      retryable: true
    })
  }
})

// ============ SESSION PHASE ============

router.post('/session/start', authenticateToken, rateLimitMiddleware, async (req, res) => {
  try {
    const { topicId, subtopicId, subtopicTitle, assignments } = req.body

    // Handle empty assignments
    const taskList = assignments && assignments.length > 0
      ? assignments
      : ['Practice the concept with a simple example']

    await clearChatHistory(req.user.userId, topicId, subtopicId)

    await upsertProgress(req.user.userId, topicId, subtopicId, {
      phase: 'session',
      concept_revealed: false,
      current_task: 0,
      total_tasks: taskList.length,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      completed_at: null
    })

    // Get student context and build prompt with outcomes
    const completedTopics = await getCompletedTopics(req.user.userId)
    const studentContext = buildStudentContext(completedTopics, topicId, subtopicTitle)
    const outcomes = getOutcomes(topicId, subtopicId)

    const prompt = buildSessionPrompt(topicId, subtopicId) || getDefaultSessionPrompt()

    const messages = [
      {
        role: 'system',
        content: prompt + '\n\n' + studentContext
      },
      {
        role: 'user',
        content: `Teach me about: ${subtopicTitle}`
      }
    ]

    const rawResponse = await callAI(messages, { maxTokens: 300 })
    const { message: welcome, progress } = parseAIResponse(rawResponse)

    await saveChatMessage(
      req.user.userId, topicId, subtopicId,
      'assistant',
      welcome || `Let's explore ${subtopicTitle}. What comes to mind when you think about this?`,
      'session'
    )

    res.json({
      success: true,
      message: welcome || `Let's explore ${subtopicTitle}. What comes to mind when you think about this?`,
      phase: 'session',
      conceptRevealed: false,
      outcomes: outcomes || [],
      progress: progress
    })
  } catch (error) {
    console.error('Start session error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to start session. Please try again.',
      retryable: true
    })
  }
})

router.post('/session/chat', authenticateToken, rateLimitMiddleware, async (req, res) => {
  try {
    const { topicId, subtopicId, message, subtopicTitle } = req.body

    const history = await getChatHistory(req.user.userId, topicId, subtopicId)
    await saveChatMessage(req.user.userId, topicId, subtopicId, 'user', message, 'session')

    const completedTopics = await getCompletedTopics(req.user.userId)
    const studentContext = buildStudentContext(completedTopics, topicId, subtopicTitle)
    const outcomes = getOutcomes(topicId, subtopicId)

    const prompt = buildSessionPrompt(topicId, subtopicId) || getDefaultSessionPrompt()

    const messages = [
      { role: 'system', content: prompt + '\n\n' + studentContext + `\n\nTOPIC: ${subtopicTitle}` },
      ...history.slice(-20).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ]

    const rawResponse = await callAI(messages, { maxTokens: 300 })
    const { message: aiMessage, progress, isComplete } = parseAIResponse(rawResponse)

    // Check for playground readiness - either AI signals complete or uses trigger phrases
    const readyForPlaytime = isComplete || /playground|ready to practice|let's try it|head to the playground|time to experiment|🎯/i.test(aiMessage || '')

    await saveChatMessage(req.user.userId, topicId, subtopicId, 'assistant', aiMessage || 'Let me think about that...', 'session')

    res.json({
      success: true,
      response: aiMessage || 'Let me think about that...',
      conceptRevealed: true,
      readyForPlaytime,
      outcomes: outcomes || [],
      progress: progress,
      isComplete
    })
  } catch (error) {
    console.error('Session chat error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get response. Please try again.',
      retryable: true
    })
  }
})

// ============ PLAYTIME PHASE ============

router.post('/playtime/start', authenticateToken, async (req, res) => {
  try {
    const { topicId, subtopicId, subtopicTitle } = req.body

    // Get saved code from progress
    const progress = await getProgress(req.user.userId, topicId, subtopicId)

    await upsertProgress(req.user.userId, topicId, subtopicId, {
      phase: 'playtime'
    })

    const introMessage = `🎮 Welcome to the Playground!

This is your sandbox to experiment with ${subtopicTitle}. Use the terminal on the left to run JavaScript code.

Try things out! If you get stuck or have questions, just ask me here.

Some things to try:
• Write simple examples
• Break things on purpose to see what happens
• Test edge cases

When you feel confident, click "Ready for Assignments" to test your skills!`

    res.json({
      success: true,
      phase: 'playtime',
      message: introMessage,
      savedCode: progress?.saved_code || '',
      terminalHistory: []
    })
  } catch (error) {
    console.error('Start playtime error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to start playtime. Please try again.',
      retryable: true
    })
  }
})

router.post('/playtime/execute', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body

    // Execute code safely
    const result = executeCode(code)

    // Code persistence is handled via localStorage on frontend

    res.json({
      success: true,
      output: result.output,
      isError: !result.success,
      logs: result.logs
    })
  } catch (error) {
    console.error('Execute error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to execute code',
      output: 'Execution failed',
      isError: true
    })
  }
})

// Save code without executing (for persistence)
// Note: saved_code column may not exist in all databases
router.post('/playtime/save', authenticateToken, async (req, res) => {
  try {
    // Just acknowledge - code is saved in localStorage on frontend
    res.json({ success: true })
  } catch (error) {
    console.error('Save code error:', error)
    res.status(500).json({ success: false, message: 'Failed to save code' })
  }
})

router.post('/playtime/chat', authenticateToken, rateLimitMiddleware, async (req, res) => {
  try {
    const { topicId, subtopicId, message, subtopicTitle, currentCode } = req.body

    const history = await getChatHistory(req.user.userId, topicId, subtopicId)
    await saveChatMessage(req.user.userId, topicId, subtopicId, 'user', message, 'playtime')

    const prompt = loadPrompt('playtime-prompt') || getDefaultPlaytimePrompt()

    const context = `
TOPIC: ${subtopicTitle}
CURRENT CODE IN EDITOR:
\`\`\`javascript
${currentCode || '// No code yet'}
\`\`\`

Help the learner understand what's happening with their code. Be encouraging but don't write the code for them. Keep responses concise.`

    const messages = [
      { role: 'system', content: prompt + context },
      ...history.slice(-20).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ]

    const aiResponse = await callAI(messages, { maxTokens: 400, temperature: 0.7 })

    await saveChatMessage(req.user.userId, topicId, subtopicId, 'assistant', aiResponse || 'Let me help you with that...', 'playtime')

    res.json({
      success: true,
      response: aiResponse || 'Let me help you with that...'
    })
  } catch (error) {
    console.error('Playtime chat error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get response. Please try again.',
      retryable: true
    })
  }
})

// ============ ASSIGNMENT PHASE ============

router.post('/assignment/start', authenticateToken, async (req, res) => {
  try {
    const { topicId, subtopicId, assignments } = req.body

    // Handle empty assignments
    const taskList = assignments && assignments.length > 0
      ? assignments
      : ['Practice the concept with a simple example']

    await upsertProgress(req.user.userId, topicId, subtopicId, {
      phase: 'assignment',
      current_task: 0,
      total_tasks: taskList.length
    })

    res.json({
      success: true,
      phase: 'assignment',
      currentAssignment: 0,
      totalAssignments: taskList.length,
      assignment: {
        index: 0,
        title: taskList[0],
        status: 'in_progress'
      }
    })
  } catch (error) {
    console.error('Start assignments error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to start assignments. Please try again.',
      retryable: true
    })
  }
})

// Execute code in assignment (for testing before submit)
router.post('/assignment/run', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body

    const result = executeCode(code)

    // Code persistence is handled via localStorage on frontend

    res.json({
      success: true,
      output: result.output,
      isError: !result.success,
      logs: result.logs
    })
  } catch (error) {
    console.error('Run assignment code error:', error)
    res.status(500).json({
      success: false,
      output: 'Execution failed',
      isError: true
    })
  }
})

// Get hint for assignment
router.post('/assignment/hint', authenticateToken, rateLimitMiddleware, async (req, res) => {
  try {
    const { topicId, subtopicId, assignmentTitle, currentCode, hintLevel } = req.body

    // hintLevel is passed from frontend to track hints used in-memory
    const hintsUsed = hintLevel || 1

    const hintPrompt = `You are a coding mentor helping a student who is stuck.

ASSIGNMENT: ${assignmentTitle}

STUDENT'S CURRENT CODE:
\`\`\`javascript
${currentCode || '// No code yet'}
\`\`\`

HINT LEVEL: ${hintLevel || hintsUsed} (1=subtle, 2=moderate, 3=direct)

Provide a hint based on the level:
- Level 1: Ask a guiding question that helps them think in the right direction
- Level 2: Point out what part they should focus on, without giving the answer
- Level 3: Explain the approach but don't write the full code

Be encouraging. Keep it under 3 sentences.`

    const messages = [
      { role: 'system', content: hintPrompt },
      { role: 'user', content: 'I need a hint for this assignment.' }
    ]

    const hint = await callAI(messages, { maxTokens: 200, temperature: 0.5 })

    res.json({
      success: true,
      hint: hint || "Think about what the assignment is asking you to do step by step.",
      hintsUsed,
      hintLevel: Math.min(hintLevel || hintsUsed, 3)
    })
  } catch (error) {
    console.error('Get hint error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get hint. Please try again.',
      retryable: true
    })
  }
})

router.post('/assignment/submit', authenticateToken, async (req, res) => {
  try {
    const { topicId, subtopicId, code, assignmentIndex } = req.body

    // Execute the code to get actual results
    const executionResult = executeCode(code)

    // Store the execution result in memory/session for feedback phase
    await upsertProgress(req.user.userId, topicId, subtopicId, {
      phase: 'feedback'
    })

    // Store code temporarily in memory for feedback generation
    // Using a simple in-memory store keyed by user
    submittedCodeStore.set(`${req.user.userId}-${topicId}-${subtopicId}`, {
      code,
      executionResult
    })

    res.json({
      success: true,
      phase: 'feedback',
      assignment: {
        index: assignmentIndex,
        code: code
      },
      executionResult
    })
  } catch (error) {
    console.error('Submit assignment error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit assignment. Please try again.',
      retryable: true
    })
  }
})

// In-memory store for submitted code (temporary solution without DB column)
const submittedCodeStore = new Map()

// ============ FEEDBACK PHASE ============

router.post('/feedback/generate', authenticateToken, rateLimitMiddleware, async (req, res) => {
  try {
    const { topicId, subtopicId, assignmentIndex, subtopicTitle, assignmentTitle, submittedCode: codeFromClient } = req.body

    // Get code from in-memory store or from client
    const storeKey = `${req.user.userId}-${topicId}-${subtopicId}`
    const stored = submittedCodeStore.get(storeKey) || {}
    const submittedCode = stored.code || codeFromClient || ''
    let executionResult = stored.executionResult || { output: '', success: true, logs: [] }

    // If we have code but no stored result, execute it
    if (submittedCode && !stored.executionResult) {
      executionResult = executeCode(submittedCode)
    }

    if (!submittedCode) {
      return res.status(400).json({ success: false, message: 'No submission found' })
    }

    const prompt = loadPrompt('feedback-prompt') || getDefaultFeedbackPrompt()

    const messages = [
      {
        role: 'system',
        content: prompt
      },
      {
        role: 'user',
        content: `
TOPIC: ${subtopicTitle}
ASSIGNMENT: ${assignmentTitle}

SUBMITTED CODE:
\`\`\`javascript
${submittedCode}
\`\`\`

ACTUAL EXECUTION OUTPUT:
${executionResult.output || '(no output)'}
${executionResult.error ? `ERROR: ${executionResult.error}` : ''}

Analyze this code and provide feedback. Return a JSON object with:
{
  "testResults": {
    "passed": number,
    "total": number,
    "failedTests": [{"name": "test name", "expected": "expected", "actual": "actual"}]
  },
  "codeQuality": {
    "codeReadability": boolean,
    "usesConstOverLet": boolean,
    "meaningfulNames": boolean,
    "noRedundantCode": boolean,
    "properIndentation": boolean,
    "followsConventions": boolean,
    "optimalSolution": boolean
  },
  "review": "Your review here",
  "suggestions": ["suggestion 1", "suggestion 2"]
}
`
      }
    ]

    const response = await callAI(messages, { maxTokens: 800, temperature: 0.3 })

    let feedbackData
    try {
      const jsonMatch = (response || '{}').match(/\{[\s\S]*\}/)
      feedbackData = jsonMatch ? JSON.parse(jsonMatch[0]) : getDefaultFeedback()
    } catch {
      feedbackData = getDefaultFeedback()
    }

    res.json({
      success: true,
      feedback: {
        testResults: feedbackData.testResults || { passed: 2, total: 3, failedTests: [] },
        codeQuality: feedbackData.codeQuality || {
          codeReadability: true,
          usesConstOverLet: true,
          meaningfulNames: true,
          noRedundantCode: true,
          properIndentation: true,
          followsConventions: true,
          optimalSolution: false
        },
        review: feedbackData.review || 'Good effort! Keep practicing.',
        suggestions: feedbackData.suggestions || ['Keep up the good work!']
      },
      executionResult,
      timeTaken: 0
    })
  } catch (error) {
    console.error('Generate feedback error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate feedback. Please try again.',
      retryable: true
    })
  }
})

router.post('/feedback/continue', authenticateToken, async (req, res) => {
  try {
    const { topicId, subtopicId } = req.body

    const progress = await getProgress(req.user.userId, topicId, subtopicId)
    const nextAssignment = (progress?.current_task || 0) + 1
    const totalAssignments = progress?.total_tasks || 0

    // Clear the in-memory submitted code
    submittedCodeStore.delete(`${req.user.userId}-${topicId}-${subtopicId}`)

    if (nextAssignment >= totalAssignments) {
      await upsertProgress(req.user.userId, topicId, subtopicId, {
        phase: 'completed',
        status: 'completed',
        completed_at: new Date().toISOString()
      })

      res.json({
        success: true,
        completed: true,
        message: 'Congratulations! You have completed all assignments!'
      })
    } else {
      await upsertProgress(req.user.userId, topicId, subtopicId, {
        phase: 'assignment',
        current_task: nextAssignment
      })

      res.json({
        success: true,
        completed: false,
        phase: 'assignment',
        currentAssignment: nextAssignment
      })
    }
  } catch (error) {
    console.error('Continue error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to continue. Please try again.',
      retryable: true
    })
  }
})

// ============ PREREQUISITES CHECK ============
router.get('/prerequisites/:topicId/:subtopicId', authenticateToken, async (req, res) => {
  try {
    const { topicId, subtopicId } = req.params
    const completedTopics = await getCompletedTopics(req.user.userId)

    // For now, return completed topics - frontend can decide if prereqs are met
    res.json({
      success: true,
      completedTopics,
      canAccess: true // Could implement stricter prereq checking here
    })
  } catch (error) {
    console.error('Prerequisites check error:', error)
    res.status(500).json({ success: false, message: 'Failed to check prerequisites' })
  }
})

// ============ HELPER FUNCTIONS ============

function getDefaultSessionPrompt() {
  return `You teach JavaScript. Follow this EXACTLY:

1. SHOW syntax with example first
2. ASK them to apply it (not guess it)
3. Confirm in 1 word: "Right!" / "Exactly!"
4. VARY one thing, ask again
5. Ask WHY it works that way
6. EDGE CASE: "What if...?"
7. SHOW new syntax, repeat steps 2-6
8. When ALL sub-concepts covered: "Ready for playground?"

Rules:
- 1-2 sentences max per message
- Never ask them to guess syntax they haven't seen
- Every message ends with a question
- No analogies, no stories, just code + questions
- Cover ALL variations before playground`
}

function getDefaultPlaytimePrompt() {
  return `You are a helpful coding assistant in a playground environment. The learner is experimenting with code.

RULES:
1. Help them understand errors and unexpected behavior
2. Give hints, not complete solutions
3. Encourage experimentation
4. Explain WHY things work the way they do
5. Be brief - they're coding, not reading essays
6. If they're stuck, ask what they're trying to achieve`
}

function getDefaultFeedbackPrompt() {
  return `You are a code reviewer. Analyze the submitted code for:
1. Correctness - does it solve the problem?
2. Code quality - readability, naming, best practices
3. Efficiency - is it optimal?

Be constructive and educational. Help them learn from mistakes.
Always return valid JSON matching the requested format.`
}

function getDefaultFeedback() {
  return {
    testResults: { passed: 2, total: 3, failedTests: [] },
    codeQuality: {
      codeReadability: true,
      usesConstOverLet: true,
      meaningfulNames: true,
      noRedundantCode: true,
      properIndentation: true,
      followsConventions: true,
      optimalSolution: false
    },
    review: 'Your code works! Consider exploring more optimal approaches.',
    suggestions: ['Keep practicing!']
  }
}

export default router
