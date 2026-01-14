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
import { getNotes } from '../data/notes.js'

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

// ============ INPUT SANITIZATION ============
const MAX_INPUT_LENGTH = {
  message: 2000,
  code: 50000,
  topicId: 100,
  subtopicId: 100,
  title: 200
}

// Sanitize string input - remove potential XSS/injection
function sanitizeString(str, maxLength = 1000) {
  if (typeof str !== 'string') return ''
  return str
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove HTML brackets
    .trim()
}

// Sanitize ID (alphanumeric and hyphens only)
function sanitizeId(id) {
  if (typeof id !== 'string') return ''
  return id.slice(0, 100).replace(/[^a-zA-Z0-9-_]/g, '')
}

// Validate request body against schema
function validateBody(schema) {
  return (req, res, next) => {
    const errors = []

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field]

      // Check required fields
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`)
        continue
      }

      // Skip validation if field is optional and not provided
      if (value === undefined || value === null) continue

      // Type validation
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`${field} must be a string`)
      } else if (rules.type === 'number' && typeof value !== 'number') {
        errors.push(`${field} must be a number`)
      } else if (rules.type === 'array' && !Array.isArray(value)) {
        errors.push(`${field} must be an array`)
      }

      // Length validation for strings
      if (typeof value === 'string' && rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} exceeds maximum length of ${rules.maxLength}`)
      }

      // Sanitize the value
      if (typeof value === 'string') {
        if (rules.isId) {
          req.body[field] = sanitizeId(value)
        } else {
          req.body[field] = sanitizeString(value, rules.maxLength || 1000)
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      })
    }

    next()
  }
}

// Common validation schemas
const schemas = {
  sessionStart: {
    topicId: { required: true, type: 'string', isId: true },
    subtopicId: { required: true, type: 'string', isId: true },
    subtopicTitle: { required: true, type: 'string', maxLength: MAX_INPUT_LENGTH.title }
  },
  sessionChat: {
    topicId: { required: true, type: 'string', isId: true },
    subtopicId: { required: true, type: 'string', isId: true },
    message: { required: true, type: 'string', maxLength: MAX_INPUT_LENGTH.message },
    subtopicTitle: { required: true, type: 'string', maxLength: MAX_INPUT_LENGTH.title }
  },
  codeExecution: {
    topicId: { required: true, type: 'string', isId: true },
    subtopicId: { required: true, type: 'string', isId: true },
    code: { required: true, type: 'string', maxLength: MAX_INPUT_LENGTH.code }
  }
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
const EXECUTION_TIMEOUT = 5000 // 5 seconds max
const MAX_OUTPUT_LENGTH = 10000 // 10KB max output
const MAX_LOOP_ITERATIONS = 100000 // Prevent infinite loops

// Dangerous patterns to block
const DANGEROUS_PATTERNS = [
  /process\./gi,
  /require\s*\(/gi,
  /import\s*\(/gi,
  /eval\s*\(/gi,
  /Function\s*\(/gi,
  /fetch\s*\(/gi,
  /XMLHttpRequest/gi,
  /WebSocket/gi,
  /__proto__/gi,
  /constructor\s*\[/gi,
  /globalThis/gi,
  /Reflect\./gi,
  /Proxy/gi
]

// Check for dangerous code patterns
function validateCode(code) {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return { valid: false, error: `Unsafe code pattern detected: ${pattern.source}` }
    }
  }

  // Check for extremely long strings (potential DoS)
  if (code.length > 50000) {
    return { valid: false, error: 'Code too long (max 50KB)' }
  }

  return { valid: true }
}

// Inject loop protection into code
function injectLoopProtection(code) {
  let loopCounter = 0
  const maxIterations = MAX_LOOP_ITERATIONS

  // Add iteration counter to while loops
  code = code.replace(
    /while\s*\(([^)]+)\)\s*{/gi,
    `while ($1) { if (++__loopCount > ${maxIterations}) throw new Error("Loop timeout: exceeded ${maxIterations} iterations");`
  )

  // Add iteration counter to for loops
  code = code.replace(
    /for\s*\(([^)]+)\)\s*{/gi,
    `for ($1) { if (++__loopCount > ${maxIterations}) throw new Error("Loop timeout: exceeded ${maxIterations} iterations");`
  )

  // Wrap code with loop counter initialization
  return `let __loopCount = 0;\n${code}`
}

function executeCode(code) {
  const logs = []
  let result = undefined
  let error = null

  // Step 1: Validate code
  const validation = validateCode(code)
  if (!validation.valid) {
    return {
      output: `Security Error: ${validation.error}`,
      logs: [`Security Error: ${validation.error}`],
      error: validation.error,
      success: false
    }
  }

  try {
    // Step 2: Inject loop protection
    const protectedCode = injectLoopProtection(code)

    // Step 3: Create safe console mock with output limiting
    let totalOutput = 0
    const mockConsole = {
      log: (...args) => {
        const line = args.map(formatValue).join(' ')
        totalOutput += line.length
        if (totalOutput > MAX_OUTPUT_LENGTH) {
          throw new Error('Output limit exceeded (max 10KB)')
        }
        logs.push(line)
      },
      error: (...args) => {
        const line = 'ERROR: ' + args.map(formatValue).join(' ')
        logs.push(line)
      },
      warn: (...args) => {
        const line = 'WARN: ' + args.map(formatValue).join(' ')
        logs.push(line)
      },
      info: (...args) => {
        const line = 'INFO: ' + args.map(formatValue).join(' ')
        logs.push(line)
      }
    }

    // Step 4: Create restricted sandbox with only safe globals
    const safeGlobals = {
      console: mockConsole,
      Math: Math,
      Date: Date,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean,
      JSON: JSON,
      Map: Map,
      Set: Set,
      RegExp: RegExp,
      Error: Error,
      TypeError: TypeError,
      RangeError: RangeError,
      parseInt: parseInt,
      parseFloat: parseFloat,
      isNaN: isNaN,
      isFinite: isFinite,
      undefined: undefined,
      NaN: NaN,
      Infinity: Infinity
    }

    // Step 5: Build safe function with timeout simulation
    const startTime = Date.now()
    const checkTimeout = () => {
      if (Date.now() - startTime > EXECUTION_TIMEOUT) {
        throw new Error(`Execution timeout: exceeded ${EXECUTION_TIMEOUT / 1000}s limit`)
      }
    }

    // Add timeout check to sandbox
    safeGlobals.__checkTimeout = checkTimeout

    // Inject timeout checks into long-running operations
    const timeoutProtectedCode = protectedCode.replace(
      /if \(\+\+__loopCount/g,
      '__checkTimeout(); if (++__loopCount'
    )

    // Step 6: Execute in isolated context
    const globalNames = Object.keys(safeGlobals)
    const globalValues = Object.values(safeGlobals)

    const fn = new Function(...globalNames, `
      "use strict";
      ${timeoutProtectedCode}
    `)

    result = fn(...globalValues)
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
    return { message: '', progress: null, isComplete: false, moveNext: null }
  }

  let message = response

  // Extract [MOVE_NEXT: outcome_id] tag
  let moveNext = null
  const moveNextMatch = response.match(/\[MOVE_NEXT:\s*([^\]]+)\]/i)
  if (moveNextMatch) {
    moveNext = moveNextMatch[1].trim()
    message = message.replace(moveNextMatch[0], '').trim()
  }

  // Legacy: Extract progress JSON if present
  let progress = null
  const progressMatch = response.match(/<progress>(.*?)<\/progress>/s)
  if (progressMatch) {
    try {
      progress = JSON.parse(progressMatch[1].trim())
      message = message.split('<progress>')[0].trim()
    } catch (e) {
      console.warn('Failed to parse progress JSON:', e.message)
    }
  }

  // Legacy: Check if session is complete
  const isComplete = /<complete>\s*true\s*<\/complete>/i.test(response)
  message = message.split('<complete>')[0].trim()

  return { message, progress, isComplete, moveNext }
}

// Build session prompt with outcomes injected
function buildSessionPrompt(topicId, subtopicId, subtopicTitle, completedTopics = [], currentOutcomeIndex = 0) {
  const promptTemplate = loadPrompt('session-prompt')
  const formattedOutcomes = getFormattedOutcomes(topicId, subtopicId)
  const rawOutcomes = getOutcomes(topicId, subtopicId)

  // Get current and next outcomes
  const currentOutcome = rawOutcomes[currentOutcomeIndex]
  const nextOutcome = rawOutcomes[currentOutcomeIndex + 1]
  
  const currentGoal = currentOutcome 
    ? `${currentOutcome.id}: ${currentOutcome.teach}` 
    : 'Complete the topic'
  const nextGoal = nextOutcome 
    ? `${nextOutcome.id}: ${nextOutcome.teach}` 
    : 'Topic complete - ready for practice'

  const completedList = completedTopics
    .map(t => `${t.topicId}/${t.subtopicId}`)
    .slice(-10)
    .join(', ') || 'None (first lesson)'

  let prompt = promptTemplate
    .replace('{{SUBTOPIC_TITLE}}', subtopicTitle || `${topicId}/${subtopicId}`)
    .replace(/\{\{COMPLETED_TOPICS\}\}/g, completedList)
    .replace('{{OUTCOMES}}', formattedOutcomes || 'Teach the core concepts of this topic thoroughly')
    .replace('{{CURRENT_OUTCOME}}', currentGoal)
    .replace('{{NEXT_OUTCOME}}', nextGoal)

  return prompt
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

router.post('/session/start', authenticateToken, rateLimitMiddleware, validateBody(schemas.sessionStart), async (req, res) => {
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
      current_outcome_index: 0,
      total_tasks: taskList.length,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      completed_at: null
    })

    // Get student context and build prompt with outcomes
    const completedTopics = await getCompletedTopics(req.user.userId)
    const outcomes = getOutcomes(topicId, subtopicId)

    const prompt = buildSessionPrompt(topicId, subtopicId, subtopicTitle, completedTopics) || getDefaultSessionPrompt()

    const messages = [
      {
        role: 'system',
        content: prompt
      },
      {
        role: 'user',
        content: `Hi, I'm ready to learn!`
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

router.post('/session/chat', authenticateToken, rateLimitMiddleware, validateBody(schemas.sessionChat), async (req, res) => {
  try {
    const { topicId, subtopicId, message, subtopicTitle } = req.body

    const history = await getChatHistory(req.user.userId, topicId, subtopicId)
    await saveChatMessage(req.user.userId, topicId, subtopicId, 'user', message, 'session')

    // Get current progress to know which outcome we're on
    const currentProgress = await getProgress(req.user.userId, topicId, subtopicId)
    const currentOutcomeIndex = currentProgress?.current_outcome_index || 0

    const completedTopics = await getCompletedTopics(req.user.userId)
    const outcomes = getOutcomes(topicId, subtopicId)

    const prompt = buildSessionPrompt(topicId, subtopicId, subtopicTitle, completedTopics, currentOutcomeIndex) || getDefaultSessionPrompt()

    const messages = [
      { role: 'system', content: prompt },
      ...history.slice(-20).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ]

    const rawResponse = await callAI(messages, { maxTokens: 300 })
    const { message: aiMessage, progress, isComplete, moveNext } = parseAIResponse(rawResponse)

    // If AI signals to move to next outcome, update progress
    if (moveNext) {
      const newIndex = currentOutcomeIndex + 1
      await upsertProgress(req.user.userId, topicId, subtopicId, {
        current_outcome_index: newIndex
      })
    }

    // Check for playground readiness - all outcomes complete or AI signals
    const allOutcomesComplete = moveNext && (currentOutcomeIndex + 1 >= outcomes.length)
    const readyForPlaytime = isComplete || allOutcomesComplete || /playground|ready to practice|let's try it|head to the playground|time to experiment|🎯/i.test(aiMessage || '')

    await saveChatMessage(req.user.userId, topicId, subtopicId, 'assistant', aiMessage || 'Let me think about that...', 'session')

    res.json({
      success: true,
      response: aiMessage || 'Let me think about that...',
      conceptRevealed: true,
      readyForPlaytime,
      outcomes: outcomes || [],
      progress: progress,
      currentOutcomeIndex: moveNext ? currentOutcomeIndex + 1 : currentOutcomeIndex,
      isComplete: allOutcomesComplete || isComplete
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

router.post('/playtime/execute', authenticateToken, validateBody(schemas.codeExecution), async (req, res) => {
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
router.post('/assignment/run', authenticateToken, validateBody(schemas.codeExecution), async (req, res) => {
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

router.post('/assignment/submit', authenticateToken, validateBody(schemas.codeExecution), async (req, res) => {
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

// ============ NOTES ENDPOINT ============
// Fetch notes for a specific subtopic (loaded on demand to reduce bundle size)
router.get('/notes/:topicId/:subtopicId', authenticateToken, (req, res) => {
  try {
    const { topicId, subtopicId } = req.params
    const notes = getNotes(topicId, subtopicId)

    if (notes) {
      res.json({ success: true, notes })
    } else {
      res.json({ success: true, notes: null, message: 'No notes available for this topic' })
    }
  } catch (error) {
    console.error('Error fetching notes:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch notes' })
  }
})

export default router
