/**
 * Database Service - Sara Learning Platform
 * Industry-level database operations with single-topic architecture
 */

import { createClient } from '@supabase/supabase-js'
import { withPerformanceLogging, progressCache } from '../middleware/performance.js'

// ============ SUPABASE CLIENT ============
let supabase = null

// Development mode fallback data
const DEV_USERS = new Map()
const DEV_PROGRESS = new Map()
const DEV_CHAT_SESSIONS = new Map()

// Initialize database connection
function initializeDatabase() {
  if (supabase) return supabase

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  // Check if we have placeholder values (development mode)
  const isPlaceholderConfig = !supabaseUrl || !supabaseKey ||
    supabaseUrl.includes('your_') || supabaseKey.includes('your_')

  if (isPlaceholderConfig) {
    return 'DEV_MODE' // Special marker for development mode
  }

  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      db: {
        schema: 'public'
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          'x-application-name': 'sara-api'
        }
      }
    })
    return supabase
  } catch (error) {
    throw error
  }
}

// ============ USER OPERATIONS ============

/** Escape a string for use in ILIKE so it matches literally (no wildcards). */
function escapeIlike(str) {
  if (typeof str !== 'string') return ''
  return str.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
}

export async function createUser(username, email, name, hashedPassword, securityQuestion = null, securityAnswer = null) {
  const client = initializeDatabase()

  // Development mode fallback
  if (client === 'DEV_MODE') {
    // Check for existing users (case-insensitive)
    const lower = username.toLowerCase()
    for (const key of DEV_USERS.keys()) {
      if (key.toLowerCase() === lower) {
        throw new Error('Username already exists')
      }
    }
    for (const user of DEV_USERS.values()) {
      if (user.email === email) {
        throw new Error('Email already exists')
      }
    }

    const userId = Date.now().toString()
    const user = {
      id: userId,
      username,
      email,
      name,
      password: hashedPassword,
      security_question: securityQuestion,
      security_answer: securityAnswer,
      has_access: false,
      email_verified: false, // Match schema default
      created_at: new Date().toISOString()
    }
    DEV_USERS.set(username, user)
    return user
  }

  // Case-insensitive duplicate check (DB unique is on username; this prevents Ram/ram)
  const existingByUsername = await getUserByUsername(username)
  if (existingByUsername) {
    throw new Error('Username already exists')
  }

  // Prepare user data - only include security fields if provided
  const userData = {
    username,
    email,
    name,
    password: hashedPassword,
    has_access: false, // Default false; set true after payment/subscription
    email_verified: false // Explicit default
  }

  // Only add security fields if they're provided (avoid storing empty strings)
  if (securityQuestion && securityQuestion.trim()) {
    userData.security_question = securityQuestion.trim()
  }
  if (securityAnswer && securityAnswer.trim()) {
    userData.security_answer = securityAnswer.trim()
  }

  const { data, error } = await client
    .from('users')
    .insert(userData)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      if (error.message.includes('username')) {
        throw new Error('Username already exists')
      }
      if (error.message.includes('email')) {
        throw new Error('Email already exists')
      }
    }
    throw new Error(`Failed to create user: ${error.message}`)
  }
  return data
}

export async function getUserById(userId) {
  const client = initializeDatabase()

  // Development mode fallback
  if (client === 'DEV_MODE') {
    for (const user of DEV_USERS.values()) {
      if (user.id === userId) {
        return user
      }
    }
    return null
  }

  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    } else {
      throw new Error(`Failed to get user by ID: ${error.message}`)
    }
  }

  return data
}

export async function getUserByUsername(username) {
  const client = initializeDatabase()

  if (client === 'DEV_MODE') {
    const lower = (username || '').toLowerCase()
    for (const [key, user] of DEV_USERS.entries()) {
      if (key.toLowerCase() === lower) return user
    }
    return null
  }

  // Case-insensitive lookup: ILIKE with escaped value for exact match
  const pattern = escapeIlike(username || '')
  const { data, error } = await client
    .from('users')
    .select('*')
    .ilike('username', pattern)
    .maybeSingle()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    } else {
      throw new Error(`Failed to get user by username: ${error.message}`)
    }
  }

  return data
}

export async function getUserByEmail(email) {
  const client = initializeDatabase()

  // Development mode fallback
  if (client === 'DEV_MODE') {
    for (const user of DEV_USERS.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get user by email: ${error.message}`)
  }
  return data
}

export async function getUserByStudentId(studentId) {
  // Legacy compatibility - map to username
  return await getUserByUsername(studentId)
}

export async function updateUserProfile(userId, updates) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      if (error.message.includes('username')) {
        throw new Error('Username already exists')
      }
      if (error.message.includes('email')) {
        throw new Error('Email already exists')
      }
    }
    throw new Error(`Failed to update user profile: ${error.message}`)
  }
  return data
}

export async function updateUserAccess(userId, hasAccess, expiresAt = null) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('users')
    .update({
      has_access: hasAccess,
      access_expires_at: expiresAt,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update user access: ${error.message}`)
  return data
}

export async function updateLastLogin(userId) {
  const client = initializeDatabase()
  const { error } = await client
    .from('users')
    .update({
      last_login: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) throw new Error(`Failed to update last login: ${error.message}`)
}

export async function getAllUsers() {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('users')
    .select('id, username, email, name, has_access, access_expires_at, last_login, created_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Failed to get users: ${error.message}`)
  return data || []
}

export async function isAdmin(userId) {
  const client = initializeDatabase()
  if (client === 'DEV_MODE') {
    return true
  }
  const { data } = await client
    .from('admins')
    .select('id')
    .eq('user_id', userId)
    .single()

  return !!data
}

// ============ PROGRESS OPERATIONS ============

export async function getProgress(userId, topicId) {
  const cacheKey = `progress:${userId}:${topicId}`

  // Check cache first
  const cached = progressCache.get(cacheKey)
  if (cached) {
    return cached
  }

  return await withPerformanceLogging(async () => {
    const client = initializeDatabase()

    // Development mode fallback
    if (client === 'DEV_MODE') {
      const progressKey = `${userId}:${topicId}`
      const progress = DEV_PROGRESS.get(progressKey)
      if (progress) {
        progressCache.set(cacheKey, progress)
      }
      return progress || null
    }

    const { data, error } = await client
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get progress: ${error.message}`)
    }

    // Cache the result
    if (data) {
      progressCache.set(cacheKey, data)
    }

    return data
  }, `getProgress(${topicId})`)
}

export async function upsertProgress(userId, topicId, updates) {
  return await withPerformanceLogging(async () => {
    const client = initializeDatabase()

    // Development mode fallback
    if (client === 'DEV_MODE') {
      const progressKey = `${userId}:${topicId}`
      const existingProgress = DEV_PROGRESS.get(progressKey) || {}
      const newProgress = {
        user_id: userId,
        topic_id: topicId,
        ...existingProgress,
        ...updates,
        updated_at: new Date().toISOString()
      }
      DEV_PROGRESS.set(progressKey, newProgress)

      // Update cache
      const cacheKey = `progress:${userId}:${topicId}`
      progressCache.set(cacheKey, newProgress)

      return newProgress
    }

    // Only send columns that exist on progress table (after migration 001: no last_accessed, etc.)
    const allowed = ['phase', 'status', 'current_task', 'total_tasks', 'assignments_completed', 'updated_at', 'topic_id']
    const safeUpdates = {}
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(updates, key) && updates[key] !== undefined) {
        safeUpdates[key] = updates[key]
      }
    }
    const payload = {
      user_id: userId,
      topic_id: topicId,
      ...safeUpdates,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await client
      .from('progress')
      .upsert(payload, { onConflict: 'user_id,topic_id' })
      .select()
      .single()

    if (error) throw new Error(`Failed to update progress: ${error.message}`)

    // Invalidate and update cache
    const cacheKey = `progress:${userId}:${topicId}`
    progressCache.set(cacheKey, data)

    return data
  }, `upsertProgress(${topicId})`)
}

export async function getAllProgress(userId) {
  const client = initializeDatabase()

  // Development mode: read from in-memory map (so /continue and /progress work without Supabase)
  if (client === 'DEV_MODE') {
    const list = []
    for (const [, p] of DEV_PROGRESS.entries()) {
      if (p && String(p.user_id) === String(userId)) {
        list.push(p)
      }
    }
    list.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
    return list
  }

  const { data, error } = await client
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to get all progress: ${error.message}`)
  }
  return data || []
}

export async function getLastAccessedTopic(userId) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('progress')
    .select('topic_id, phase, updated_at')
    .eq('user_id', userId)
    .in('status', ['in_progress', 'completed'])
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get last accessed topic: ${error.message}`)
  }

  return data
}

export async function getCompletedTopics(userId) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('progress')
    .select('topic_id')
    .eq('user_id', userId)
    .eq('status', 'completed')

  if (error) throw new Error(`Failed to get completed topics: ${error.message}`)
  return data ? data.map(row => row.topic_id) : []
}

export async function getUserProgressSummary(userId) {
  const client = initializeDatabase()
  const { data, error } = await client
    .rpc('get_user_progress_summary', { p_user_id: userId })

  if (error) throw new Error(`Failed to get progress summary: ${error.message}`)
  return data?.[0] || { total_topics: 0, completed_topics: 0, in_progress_topics: 0, completion_percentage: 0 }
}

// ============ PASSWORD RESET OPERATIONS ============

export async function createPasswordResetToken(userId, token, expiresAt) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('password_reset_tokens')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create password reset token: ${error.message}`)
  return data
}

export async function getPasswordResetToken(token) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('password_reset_tokens')
    .select('*, users(id, username, email)')
    .eq('token', token)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get password reset token: ${error.message}`)
  }
  return data
}

export async function markPasswordResetTokenUsed(tokenId) {
  const client = initializeDatabase()
  const { error } = await client
    .from('password_reset_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('id', tokenId)

  if (error) throw new Error(`Failed to mark token as used: ${error.message}`)
}

export async function updateUserPassword(userId, hashedPassword) {
  const client = initializeDatabase()

  // Development mode fallback
  if (client === 'DEV_MODE') {
    for (const [username, user] of DEV_USERS.entries()) {
      if (user.id === userId) {
        user.password = hashedPassword
        user.updated_at = new Date().toISOString()
        return user
      }
    }
    throw new Error('User not found in development mode')
  }

  const { data, error } = await client
    .from('users')
    .update({
      password: hashedPassword,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update password: ${error.message}`)
  return data
}

// ============ SESSION MANAGEMENT ============

export async function createUserSession(userId, token, expiresAt, ipAddress, userAgent, refreshToken, refreshExpiresAt) {
  const client = initializeDatabase()
  
  // Build the insert object
  const sessionData = {
    user_id: userId,
    token,
    expires_at: expiresAt,
    ip_address: ipAddress,
    user_agent: userAgent
  }
  
  // Add refresh token fields if provided
  if (refreshToken && refreshExpiresAt) {
    sessionData.refresh_token = refreshToken
    sessionData.refresh_expires_at = refreshExpiresAt
  }
  
  const { data, error } = await client
    .from('user_sessions')
    .insert(sessionData)
    .select()
    .single()

  if (error) throw new Error(`Failed to create user session: ${error.message}`)
  return data
}

export async function getUserSession(token) {
  const client = initializeDatabase()
  const { data, error } = await client
    .from('user_sessions')
    .select('*, users(id, username, email, name)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get user session: ${error.message}`)
  }
  return data
}

export async function updateSessionLastAccessed(sessionId) {
  const client = initializeDatabase()
  const { error } = await client
    .from('user_sessions')
    .update({ last_accessed: new Date().toISOString() })
    .eq('id', sessionId)

  if (error) throw new Error(`Failed to update session: ${error.message}`)
}

export async function deleteUserSession(token) {
  const client = initializeDatabase()
  const { error } = await client
    .from('user_sessions')
    .delete()
    .eq('token', token)

  if (error) throw new Error(`Failed to delete session: ${error.message}`)
}

// ============ ANALYTICS OPERATIONS ============

export async function updateLearningAnalytics(userId, topicId, analytics) {
  const client = initializeDatabase()
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

  const { data, error } = await client
    .from('learning_analytics')
    .upsert({
      user_id: userId,
      topic_id: topicId,
      session_date: today,
      ...analytics,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,topic_id,session_date' })
    .select()
    .single()

  if (error) throw new Error(`Failed to update learning analytics: ${error.message}`)
  return data
}

export async function getLearningAnalytics(userId, topicId = null, days = 30) {
  const client = initializeDatabase()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  let query = client
    .from('learning_analytics')
    .select('*')
    .eq('user_id', userId)
    .gte('session_date', startDate.toISOString().split('T')[0])
    .order('session_date', { ascending: false })

  if (topicId) {
    query = query.eq('topic_id', topicId)
  }

  const { data, error } = await query

  if (error) throw new Error(`Failed to get learning analytics: ${error.message}`)
  return data || []
}

// ============ COURSE UNLOCKS (per-course access after payment) ============

const DEV_COURSE_UNLOCKS = new Map() // key: `${username}:${courseId}`
const DEV_UNLOCK_SLOTS = new Map()   // key: id (UUID), value: { id, course_id, username }

function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function getUnlockedCourseIds(userId) {
  const client = initializeDatabase()
  const user = await getUserById(userId)
  const username = user?.username || null
  if (!username) return []

  if (client === 'DEV_MODE') {
    const fromMap = Array.from(DEV_COURSE_UNLOCKS.keys()).filter(k => k.startsWith(`${username}:`))
    const fromSlots = Array.from(DEV_UNLOCK_SLOTS.values()).filter(s => s.username === username).map(s => s.course_id)
    return [...new Set([...fromMap.map(k => k.split(':')[1]), ...fromSlots])]
  }
  const { data, error } = await client
    .from('user_course_unlocks')
    .select('course_id')
    .eq('username', username)
  if (error) throw new Error(`Failed to get unlocked courses: ${error.message}`)
  return (data || []).map(row => row.course_id)
}

export async function isCourseUnlockedForUser(userId, courseId) {
  const unlocked = await getUnlockedCourseIds(userId)
  return unlocked.includes(courseId)
}

export async function unlockCourseForUser(userId, courseId) {
  const client = initializeDatabase()
  const user = await getUserById(userId)
  const username = user?.username
  if (!username) throw new Error('User not found')
  if (client === 'DEV_MODE') {
    DEV_COURSE_UNLOCKS.set(`${username}:${courseId}`, { username, courseId, unlocked_at: new Date().toISOString() })
    return { username, course_id: courseId, unlocked_at: new Date().toISOString() }
  }
  const { data, error } = await client
    .from('user_course_unlocks')
    .upsert(
      { username, course_id: courseId, unlocked_at: new Date().toISOString() },
      { onConflict: ['username', 'course_id'] }
    )
    .select()
    .single()
  if (error) throw new Error(`Failed to unlock course: ${error.message}`)
  return data
}

/** Create an unused unlock slot (admin only). Returns { id, course_id }. */
export async function createUnlockSlot(courseId) {
  const client = initializeDatabase()
  if (client === 'DEV_MODE') {
    const id = randomUUID()
    DEV_UNLOCK_SLOTS.set(id, { id, course_id: courseId, username: null })
    return { id, course_id: courseId }
  }
  const { data, error } = await client
    .from('user_course_unlocks')
    .insert({ username: null, course_id: courseId })
    .select('id, course_id')
    .single()
  if (error) throw new Error(`Failed to create unlock slot: ${error.message}`)
  return { id: data.id, course_id: data.course_id }
}

/**
 * Redeem an unlock code. Returns { success, courseId } or throws for invalid/used.
 * Code is the row id. Updates the row with username so it becomes a normal unlock.
 */
export async function redeemUnlockCode(userId, codeId) {
  const id = (codeId || '').toString().trim()
  if (!id) throw new Error('Code is required')

  const user = await getUserById(userId)
  const username = user?.username
  if (!username) throw new Error('User not found')

  const client = initializeDatabase()
  if (client === 'DEV_MODE') {
    const slot = DEV_UNLOCK_SLOTS.get(id)
    if (!slot) throw new Error('Invalid or already used code')
    if (slot.username != null) throw new Error('Code already used')
    slot.username = username
    DEV_COURSE_UNLOCKS.set(`${username}:${slot.course_id}`, { username, courseId: slot.course_id, unlocked_at: new Date().toISOString() })
    return { success: true, courseId: slot.course_id }
  }

  const { data: row, error: fetchError } = await client
    .from('user_course_unlocks')
    .select('id, username, course_id')
    .eq('id', id)
    .single()

  if (fetchError || !row) throw new Error('Invalid or already used code')
  if (row.username != null) throw new Error('Code already used')

  const { error: updateError } = await client
    .from('user_course_unlocks')
    .update({ username, unlocked_at: new Date().toISOString() })
    .eq('id', id)

  if (updateError) throw new Error('Failed to redeem code')
  return { success: true, courseId: row.course_id }
}

// Export the client for direct access if needed
export const getSupabaseClient = () => initializeDatabase()
export { initializeDatabase }