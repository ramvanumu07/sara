import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY // Service role key for backend

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY')
}

// Admin client (for backend operations - bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// =====================
// USER OPERATIONS
// =====================

export async function createUser(email, name) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({ email, name })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getUserByEmail(email) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*, subscriptions(*)')
    .eq('email', email)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return data
}

export async function getUserById(userId) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*, subscriptions(*)')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

// =====================
// SUBSCRIPTION OPERATIONS
// =====================

export async function createSubscription(userId, orderData) {
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 month subscription
  
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan: 'basic',
      status: 'active',
      amount: orderData.amount,
      razorpay_order_id: orderData.orderId,
      expires_at: expiresAt.toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function verifyPayment(orderId, paymentId, signature) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      status: 'active'
    })
    .eq('razorpay_order_id', orderId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function checkSubscriptionActive(userId) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select()
    .eq('user_id', userId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return !!data
}

export async function getSubscription(userId) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

// =====================
// PROGRESS OPERATIONS
// =====================

export async function getProgress(userId, topicId, subtopicId) {
  const { data, error } = await supabaseAdmin
    .from('progress')
    .select()
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .eq('subtopic_id', subtopicId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertProgress(userId, topicId, subtopicId, updates) {
  const { data, error } = await supabaseAdmin
    .from('progress')
    .upsert({
      user_id: userId,
      topic_id: topicId,
      subtopic_id: subtopicId,
      ...updates,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,topic_id,subtopic_id'
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getAllProgress(userId) {
  const { data, error } = await supabaseAdmin
    .from('progress')
    .select()
    .eq('user_id', userId)
  
  if (error) throw error
  return data || []
}

export async function markSubtopicComplete(userId, topicId, subtopicId) {
  return upsertProgress(userId, topicId, subtopicId, {
    status: 'completed',
    completed_at: new Date().toISOString()
  })
}

// =====================
// CHAT HISTORY OPERATIONS
// =====================

export async function getChatHistory(userId, topicId, subtopicId, limit = 50) {
  const { data, error } = await supabaseAdmin
    .from('chat_history')
    .select()
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .eq('subtopic_id', subtopicId)
    .order('created_at', { ascending: true })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

export async function addChatMessage(userId, topicId, subtopicId, role, content, phase) {
  const { data, error } = await supabaseAdmin
    .from('chat_history')
    .insert({
      user_id: userId,
      topic_id: topicId,
      subtopic_id: subtopicId,
      role,
      content,
      phase
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function clearChatHistory(userId, topicId, subtopicId) {
  const { error } = await supabaseAdmin
    .from('chat_history')
    .delete()
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .eq('subtopic_id', subtopicId)
  
  if (error) throw error
}

// =====================
// AI USAGE TRACKING
// =====================

export async function trackAIUsage(userId, tokensUsed) {
  const today = new Date().toISOString().split('T')[0]
  
  // Try to update existing record
  const { data: existing } = await supabaseAdmin
    .from('ai_usage')
    .select()
    .eq('user_id', userId)
    .eq('date', today)
    .single()
  
  if (existing) {
    const { error } = await supabaseAdmin
      .from('ai_usage')
      .update({
        tokens_used: existing.tokens_used + tokensUsed,
        requests_count: existing.requests_count + 1
      })
      .eq('id', existing.id)
    
    if (error) throw error
  } else {
    const { error } = await supabaseAdmin
      .from('ai_usage')
      .insert({
        user_id: userId,
        tokens_used: tokensUsed,
        requests_count: 1,
        date: today
      })
    
    if (error) throw error
  }
}

export async function getAIUsageToday(userId) {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabaseAdmin
    .from('ai_usage')
    .select()
    .eq('user_id', userId)
    .eq('date', today)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data || { tokens_used: 0, requests_count: 0 }
}

// =====================
// ADMIN OPERATIONS
// =====================

export async function getPlatformStats() {
  const { data, error } = await supabaseAdmin.rpc('get_platform_stats')
  if (error) throw error
  return data
}

export async function getAllUsers(limit = 100, offset = 0) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*, subscriptions(*)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) throw error
  return data || []
}

export async function isAdmin(userId) {
  const { data, error } = await supabaseAdmin
    .from('admins')
    .select()
    .eq('user_id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return !!data
}

export async function makeAdmin(userId) {
  const { data, error } = await supabaseAdmin
    .from('admins')
    .insert({ user_id: userId })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// =====================
// INITIALIZATION CHECK
// =====================

export async function checkConnection() {
  try {
    const { error } = await supabaseAdmin.from('users').select('id').limit(1)
    if (error) throw error
    return true
  } catch (err) {
    console.error('Supabase connection error:', err.message)
    return false
  }
}

