import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, '..', 'data', 'taskProgress.json')

// Default data structure
const defaultData = { 
  taskProgress: {},
  chatHistory: {},
  lastActivity: {},
  phaseState: {},        // Track learning vs assignment phase
  assignmentCount: {}    // Track completed assignments per subtopic
}

let db = null

// Initialize database
export async function initTaskDb() {
  try {
    // Ensure data directory exists
    const { mkdir } = await import('fs/promises')
    await mkdir(join(__dirname, '..', 'data'), { recursive: true })
    
    const adapter = new JSONFile(dbPath)
    db = new Low(adapter, defaultData)
    
    // Read existing data
    await db.read()
    
    // Initialize with defaults if empty
    if (!db.data) {
      db.data = defaultData
    }
    if (!db.data.taskProgress) {
      db.data.taskProgress = {}
    }
    if (!db.data.chatHistory) {
      db.data.chatHistory = {}
    }
    if (!db.data.lastActivity) {
      db.data.lastActivity = {}
    }
    if (!db.data.phaseState) {
      db.data.phaseState = {}
    }
    if (!db.data.assignmentCount) {
      db.data.assignmentCount = {}
    }
    
    await db.write()
    console.log('✅ Task progress database initialized')
    return true
  } catch (error) {
    console.error('❌ Task DB init error:', error.message)
    return false
  }
}

// Generate key for student+topic+subtopic
function getKey(studentId, topicId, subtopicId) {
  return `${studentId}:${topicId}:${subtopicId}`
}

// Get task progress for a student's subtopic
export async function getTaskProgress(studentId, topicId, subtopicId) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  const progress = db.data.taskProgress[key]
  
  if (!progress) {
    return { currentTask: 0, completedTasks: [] }
  }
  
  return {
    currentTask: progress.currentTask || 0,
    completedTasks: progress.completedTasks || []
  }
}

// Mark a task as complete
export async function markTaskComplete(studentId, topicId, subtopicId, taskIndex) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  
  if (!db.data.taskProgress[key]) {
    db.data.taskProgress[key] = { currentTask: 0, completedTasks: [] }
  }
  
  const progress = db.data.taskProgress[key]
  
  // Add to completed tasks if not already there
  if (!progress.completedTasks.includes(taskIndex)) {
    progress.completedTasks.push(taskIndex)
    progress.completedTasks.sort((a, b) => a - b)
  }
  
  // Update current task pointer
  progress.currentTask = Math.max(progress.currentTask, taskIndex + 1)
  
  // Update last activity
  db.data.lastActivity[key] = Date.now()
  
  // Save to file
  await db.write()
  
  return progress
}

// Reset task progress for a subtopic (when restarting lesson)
export async function resetTaskProgress(studentId, topicId, subtopicId) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  
  db.data.taskProgress[key] = { currentTask: 0, completedTasks: [] }
  db.data.lastActivity[key] = Date.now()
  
  await db.write()
  
  return { currentTask: 0, completedTasks: [] }
}

// Get all progress for a student (for dashboard stats)
export async function getStudentAllProgress(studentId) {
  if (!db) await initTaskDb()
  
  const studentProgress = {}
  
  for (const [key, value] of Object.entries(db.data.taskProgress)) {
    if (key.startsWith(`${studentId}:`)) {
      const [, topicId, subtopicId] = key.split(':')
      if (!studentProgress[topicId]) {
        studentProgress[topicId] = {}
      }
      studentProgress[topicId][subtopicId] = value
    }
  }
  
  return studentProgress
}

// Check if database is ready
export function isDbReady() {
  return db !== null
}

// Save task progress directly (used by chat route)
export async function saveTaskProgress(studentId, topicId, subtopicId, progress) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  
  db.data.taskProgress[key] = {
    currentTask: progress.current || progress.currentTask || 0,
    completedTasks: progress.completedTasks || [],
    total: progress.total || 0,
    completed: progress.completed || 0
  }
  
  db.data.lastActivity[key] = Date.now()
  
  await db.write()
  
  return db.data.taskProgress[key]
}

// ═══════════════════════════════════════════════════════════════
// CHAT HISTORY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// Get chat history for a student's subtopic
export async function getChatHistory(studentId, topicId, subtopicId) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  return db.data.chatHistory[key] || []
}

// Save chat history for a student's subtopic
export async function saveChatHistory(studentId, topicId, subtopicId, messages) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  
  // Keep only last 50 messages to prevent file from growing too large
  const trimmedMessages = messages.slice(-50).map(msg => ({
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp || new Date().toISOString()
  }))
  
  db.data.chatHistory[key] = trimmedMessages
  db.data.lastActivity[key] = Date.now()
  
  await db.write()
  
  return trimmedMessages
}

// Add a single message to chat history
export async function addChatMessage(studentId, topicId, subtopicId, message) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  
  if (!db.data.chatHistory[key]) {
    db.data.chatHistory[key] = []
  }
  
  db.data.chatHistory[key].push({
    role: message.role,
    content: message.content,
    timestamp: message.timestamp || new Date().toISOString()
  })
  
  // Keep only last 50 messages
  if (db.data.chatHistory[key].length > 50) {
    db.data.chatHistory[key] = db.data.chatHistory[key].slice(-50)
  }
  
  db.data.lastActivity[key] = Date.now()
  
  await db.write()
}

// Clear chat history (when restarting lesson)
export async function clearChatHistory(studentId, topicId, subtopicId) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  db.data.chatHistory[key] = []
  
  await db.write()
}

// ═══════════════════════════════════════════════════════════════
// PHASE TRACKING FUNCTIONS (Learning vs Assignment)
// ═══════════════════════════════════════════════════════════════

// Get current phase for a subtopic (returns 'learning' or 'assignment')
export async function getPhase(studentId, topicId, subtopicId) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  return db.data.phaseState[key] || 'learning'
}

// Set phase for a subtopic
export async function setPhase(studentId, topicId, subtopicId, phase) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  db.data.phaseState[key] = phase
  db.data.lastActivity[key] = Date.now()
  
  await db.write()
  return phase
}

// Get assignment count for a subtopic
export async function getAssignmentCount(studentId, topicId, subtopicId) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  return db.data.assignmentCount[key] || { completed: 0, total: 0 }
}

// Increment completed assignment count
export async function incrementAssignmentCount(studentId, topicId, subtopicId) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  
  if (!db.data.assignmentCount[key]) {
    db.data.assignmentCount[key] = { completed: 0, total: 0 }
  }
  
  db.data.assignmentCount[key].completed += 1
  db.data.assignmentCount[key].total += 1
  db.data.lastActivity[key] = Date.now()
  
  await db.write()
  return db.data.assignmentCount[key]
}

// Reset phase and assignment count (when restarting lesson)
export async function resetPhaseState(studentId, topicId, subtopicId) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  db.data.phaseState[key] = 'learning'
  db.data.assignmentCount[key] = { completed: 0, total: 0 }
  db.data.lastActivity[key] = Date.now()
  
  await db.write()
}

// Get full state for a subtopic (phase + assignments)
export async function getSubtopicState(studentId, topicId, subtopicId) {
  if (!db) await initTaskDb()
  
  const key = getKey(studentId, topicId, subtopicId)
  
  return {
    phase: db.data.phaseState[key] || 'learning',
    assignments: db.data.assignmentCount[key] || { completed: 0, total: 0 }
  }
}

