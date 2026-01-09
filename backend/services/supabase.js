import { createClient } from '@supabase/supabase-js'

let supabase = null

// Initialize Supabase (called after dotenv.config())
export function initSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Supabase connected')
    return true
  } else {
    console.log('⚠️  Supabase credentials missing')
    return false
  }
}

// Test database connection
export async function testConnection() {
  if (!supabase) return false
  try {
    const { error } = await supabase.from('users').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}

// ============ USER OPERATIONS ============

export async function createUser(studentId, hashedPassword, name) {
  const { data, error } = await supabase
    .from('users')
    .insert({ student_id: studentId, password: hashedPassword, name, has_access: false })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserByStudentId(studentId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('student_id', studentId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateUserAccess(studentId, hasAccess, expiresAt = null) {
  const { data, error } = await supabase
    .from('users')
    .update({ has_access: hasAccess, access_expires_at: expiresAt })
    .eq('student_id', studentId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, student_id, name, has_access, access_expires_at, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ============ ADMIN OPERATIONS ============

export async function isAdmin(userId) {
  const { data } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', userId)
    .single()

  return !!data
}

// ============ PROGRESS OPERATIONS ============

export async function getProgress(userId, topicId, subtopicId) {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .eq('subtopic_id', subtopicId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertProgress(userId, topicId, subtopicId, updates) {
  const { data, error } = await supabase
    .from('progress')
    .upsert({
      user_id: userId,
      topic_id: topicId,
      subtopic_id: subtopicId,
      ...updates,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,topic_id,subtopic_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAllProgress(userId) {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data || []
}

// ============ CHAT HISTORY ============

export async function getChatHistory(userId, topicId, subtopicId, phase = null) {
  let query = supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .eq('subtopic_id', subtopicId)
    .order('created_at', { ascending: true })
    .limit(100)

  if (phase) {
    query = query.eq('phase', phase)
  }

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function saveChatMessage(userId, topicId, subtopicId, role, content, phase = 'session') {
  const { error } = await supabase
    .from('chat_history')
    .insert({ user_id: userId, topic_id: topicId, subtopic_id: subtopicId, role, content, phase })

  if (error) throw error
}

export async function clearChatHistory(userId, topicId, subtopicId, phase = null) {
  let query = supabase
    .from('chat_history')
    .delete()
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .eq('subtopic_id', subtopicId)

  if (phase) {
    query = query.eq('phase', phase)
  }

  const { error } = await query

  if (error) throw error
}

export { supabase }
