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
  clearChatHistory
} from '../services/supabase.js'

const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Groq client (lazy init)
let groq = null
function getGroq() {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  }
  return groq
}

// Load session prompt once (lightweight version for token efficiency)
let SESSION_PROMPT = null
function getSessionPrompt() {
  if (!SESSION_PROMPT) {
    const promptPath = path.join(__dirname, '..', 'prompts', 'session-prompt.txt')
    try {
      SESSION_PROMPT = fs.readFileSync(promptPath, 'utf-8')
    } catch (error) {
      console.error('Failed to load session prompt:', error.message)
      SESSION_PROMPT = 'You are a JavaScript mentor. Teach through questions and review code carefully.'
    }
  }
  return SESSION_PROMPT
}

// Topics that require all code inside functions
const POST_FUNCTION_TOPICS = [
  'function-scope', 'pure-functions', 'array-methods', 'string-methods',
  'objects', 'destructuring', 'arrow-functions', 'higher-order-functions',
  'array-advanced', 'template-literals', 'spread-rest', 'error-handling',
  'async-basics', 'promises', 'async-await', 'modern-practices'
]

function isPostFunctionsTopic(topicId) {
  return POST_FUNCTION_TOPICS.includes(topicId)
}

// Build context with STRICT assignment flow enforcement
function buildContext(subtopicTitle, tasks, taskIndex, topicId) {
  const isPracticing = taskIndex > 0

  let context = `

---
CURRENT SESSION STATE:
- Topic: ${subtopicTitle}
- Assignment Progress: ${taskIndex} of ${tasks?.length || 0} completed
- Mode: ${isPracticing ? 'ASSIGNMENT REVIEW' : 'TEACHING'}
`

  if (isPostFunctionsTopic(topicId)) {
    context += `- Post-functions: ALL code must be inside functions\n`
  }

  // TEACHING MODE - not yet giving assignments
  if (!isPracticing && tasks && tasks.length > 0) {
    context += `
TEACHING PHASE RULES:
1. Teach the concept through discovery (make them feel the pain first)
2. Be DIRECT - don't over-explain once they understand
3. When they understand the concept, transition to assignments
4. Say: "Assignment 1: [task]" - be explicit with the number
5. WAIT for them to submit actual code before reviewing

ASSIGNMENTS TO GIVE (one at a time, in order):
${tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}

CRITICAL: Do NOT discuss assignments theoretically. Give "Assignment 1: ..." and WAIT for code.
`
  }

  // ASSIGNMENT MODE - reviewing code
  if (isPracticing) {
    const currentTaskNum = taskIndex
    const currentTask = tasks && tasks[taskIndex - 1] ? tasks[taskIndex - 1] : null
    const nextTask = tasks && tasks[taskIndex] ? tasks[taskIndex] : null

    context += `
ASSIGNMENT REVIEW PHASE:
- Just completed: Assignment ${currentTaskNum}${currentTask ? ` (${currentTask})` : ''}
- Next assignment: ${nextTask ? `Assignment ${taskIndex + 1}: ${nextTask}` : 'ALL DONE!'}

REVIEW RULES:
1. If they submitted CODE → Review it (correctness + quality)
2. If code is CORRECT and CLEAN → "Assignment ${currentTaskNum} complete. Assignment ${taskIndex + 1}: ${nextTask || '[next topic]'}"
3. If code is CORRECT but POOR QUALITY → Point out issues, ask them to rewrite
4. If code is WRONG → Don't give answer, ask diagnostic questions
5. If they're CONFUSED → Ask "What part is confusing?" before re-explaining
6. NEVER move to next assignment without actual code submission

QUALITY STANDARDS:
- const by default (let only if reassigning)
- Meaningful variable names (no x, temp, val)
- === not ==
- No redundant code
`
  }

  return context
}

// Detect if AI gave an assignment or completed a task review
function detectProgress(response, currentTaskIndex, totalTasks) {
  const lower = response.toLowerCase()

  // Not practicing yet (taskIndex = 0) - check if AI gave Assignment 1
  if (currentTaskIndex === 0) {
    // Look for explicit assignment giving
    const assignmentPatterns = [
      /assignment\s*1\s*:/i,
      /here'?s\s*(your\s*)?(first\s*)?assignment/i,
      /first\s*assignment\s*:/i,
      /assignment\s*#?\s*1/i
    ]

    for (const pattern of assignmentPatterns) {
      if (pattern.test(response)) {
        return { newTaskIndex: 1, isCompleted: false }
      }
    }

    // Also check for generic practice starts
    const practiceStarts = [
      "here's your first task",
      "let's start with assignment",
      "your first challenge"
    ]
    for (const phrase of practiceStarts) {
      if (lower.includes(phrase)) {
        return { newTaskIndex: 1, isCompleted: false }
      }
    }
  }

  // Already in assignment mode - check for task completion/advancement
  if (currentTaskIndex > 0) {
    // Look for "Assignment N complete" or moving to next
    const completionPatterns = [
      /assignment\s*\d+\s*(is\s*)?(complete|done|passed)/i,
      /assignment\s*(\d+)\s*:/i,  // Giving next assignment
      /here'?s\s*assignment\s*(\d+)/i,
      /moving\s*to\s*assignment\s*(\d+)/i,
      /next\s*assignment/i
    ]

    for (const pattern of completionPatterns) {
      const match = response.match(pattern)
      if (match) {
        // If we can extract the number, use it
        if (match[1]) {
          const assignmentNum = parseInt(match[1])
          if (assignmentNum > currentTaskIndex) {
            const isCompleted = assignmentNum > totalTasks
            return { newTaskIndex: assignmentNum, isCompleted }
          }
        } else {
          // Generic "next assignment" - increment
          const newIndex = currentTaskIndex + 1
          const isCompleted = newIndex > totalTasks
          return { newTaskIndex: newIndex, isCompleted }
        }
      }
    }

    // Check for all tasks complete
    const allDonePatterns = [
      /completed\s*all\s*(the\s*)?(assignments|tasks)/i,
      /all\s*assignments?\s*(are\s*)?(complete|done)/i,
      /you'?ve\s*(finished|completed)\s*all/i,
      /ready\s*for\s*(the\s*)?next\s*topic/i
    ]

    for (const pattern of allDonePatterns) {
      if (pattern.test(response)) {
        return { newTaskIndex: currentTaskIndex, isCompleted: true }
      }
    }
  }

  return { newTaskIndex: currentTaskIndex, isCompleted: false }
}

// Get chat history
router.get('/history/:topicId/:subtopicId', authenticateToken, async (req, res) => {
  try {
    const { topicId, subtopicId } = req.params
    const history = await getChatHistory(req.user.userId, topicId, subtopicId)
    const progress = await getProgress(req.user.userId, topicId, subtopicId)

    res.json({
      success: true,
      messages: history.map(m => ({ role: m.role, content: m.content })),
      currentTask: progress?.current_task || 0,
      tasksCompleted: progress?.current_task || 0,
      isCompleted: progress?.status === 'completed'
    })
  } catch (error) {
    console.error('Get history error:', error)
    res.status(500).json({ success: false, message: 'Failed to load chat history' })
  }
})

// Send message - the core conversation endpoint
router.post('/message', authenticateToken, async (req, res) => {
  try {
    const { topicId, subtopicId, message, subtopicTitle, tasks } = req.body

    if (!topicId || !subtopicId || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    // Get or create progress (simple: just track task index)
    let progress = await getProgress(req.user.userId, topicId, subtopicId)
    if (!progress) {
      progress = await upsertProgress(req.user.userId, topicId, subtopicId, {
        status: 'in_progress',
        current_task: 0,
        started_at: new Date().toISOString()
      })
    }

    const currentTaskIndex = progress.current_task || 0

    // Get full chat history - this IS the context
    const history = await getChatHistory(req.user.userId, topicId, subtopicId)

    // Save user message
    await saveChatMessage(req.user.userId, topicId, subtopicId, 'user', message)

    // Build minimal context
    const sessionPrompt = getSessionPrompt()
    const context = buildContext(subtopicTitle, tasks, currentTaskIndex, topicId)

    // Prepare messages - chat history is the primary context
    const messages = [
      { role: 'system', content: sessionPrompt + context },
      ...history.slice(-40).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ]

    // Call AI
    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',  // Smaller model, uses fewer tokens
      messages,
      temperature: 0.7,
      max_tokens: 800
    })

    const aiResponse = completion.choices[0]?.message?.content ||
      'I had trouble generating a response. Could you try again?'

    // Detect natural progress
    const { newTaskIndex, isCompleted } = detectProgress(
      aiResponse,
      currentTaskIndex,
      tasks?.length || 0
    )

    // Update progress if changed
    if (isCompleted) {
      await upsertProgress(req.user.userId, topicId, subtopicId, {
        status: 'completed',
        current_task: newTaskIndex,
        completed_at: new Date().toISOString()
      })
    } else if (newTaskIndex !== currentTaskIndex) {
      await upsertProgress(req.user.userId, topicId, subtopicId, {
        current_task: newTaskIndex
      })
    }

    // Save AI response
    await saveChatMessage(req.user.userId, topicId, subtopicId, 'assistant', aiResponse)

    res.json({
      success: true,
      response: aiResponse,
      currentTask: newTaskIndex,
      totalTasks: tasks?.length || 0,
      isCompleted
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ success: false, message: 'Failed to get response' })
  }
})

// Start new lesson
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const { topicId, subtopicId, subtopicTitle, tasks } = req.body

    // Clear and reset
    await clearChatHistory(req.user.userId, topicId, subtopicId)
    await upsertProgress(req.user.userId, topicId, subtopicId, {
      status: 'in_progress',
      current_task: 0,
      started_at: new Date().toISOString(),
      completed_at: null
    })

    // Generate opening with Socratic question
    const sessionPrompt = getSessionPrompt()
    const context = buildContext(subtopicTitle, tasks, 0, topicId)

    // Generate a specific, practical opening question based on the topic
    const openingGuidance = `

The learner wants to learn: "${subtopicTitle}"

Your opening must:
1. Present a REAL, PRACTICAL problem they'd face without this concept
2. Make them feel the pain/tedium of not having this tool
3. Be specific and concrete, not abstract
4. Be ONE short question (1-2 sentences max)

BAD openings (too generic/abstract):
- "What if you wanted to tell a computer to display a message?"
- "Have you ever wondered how programs show output?"
- "What do you think console.log does?"

GOOD openings (specific, creates real need):
- For console.log: "You write some code to calculate something. How do you check if it actually worked?"
- For variables: "If you need to use 3.14159 in five different calculations, would you type it out each time?"
- For conditionals: "Your code needs to do different things based on whether someone is logged in or not. How would you handle that?"
- For loops: "You need to send a welcome email to 1000 new users. Would you write console.log 1000 times?"
- For arrays: "How would you store the names of 50 students in your program?"
- For functions: "You've written the same 10 lines of area calculation in 5 different places. What happens when you find a bug in it?"

Ask your opening question now. ONE question only. Make them feel the problem.`

    const messages = [
      {
        role: 'system',
        content: sessionPrompt + context + openingGuidance
      },
      { role: 'user', content: `I want to learn about ${subtopicTitle}` }
    ]

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',  // Smaller model
      messages,
      temperature: 0.7,
      max_tokens: 300
    })

    const welcome = completion.choices[0]?.message?.content ||
      `Let's explore ${subtopicTitle}! Here's something to think about...`

    await saveChatMessage(req.user.userId, topicId, subtopicId, 'assistant', welcome)

    res.json({
      success: true,
      message: welcome,
      currentTask: 0,
      totalTasks: tasks?.length || 0
    })
  } catch (error) {
    console.error('Start lesson error:', error)
    res.status(500).json({ success: false, message: 'Failed to start lesson' })
  }
})

// Resume lesson
router.post('/resume', authenticateToken, async (req, res) => {
  try {
    const { topicId, subtopicId, tasks } = req.body

    const progress = await getProgress(req.user.userId, topicId, subtopicId)
    const history = await getChatHistory(req.user.userId, topicId, subtopicId)

    if (!progress || history.length === 0) {
      return res.json({ success: true, shouldStart: true })
    }

    res.json({
      success: true,
      shouldStart: false,
      currentTask: progress.current_task || 0,
      totalTasks: tasks?.length || 0,
      isCompleted: progress.status === 'completed',
      messages: history.map(m => ({ role: m.role, content: m.content }))
    })
  } catch (error) {
    console.error('Resume error:', error)
    res.status(500).json({ success: false, message: 'Failed to resume' })
  }
})

export default router
