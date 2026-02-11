/**
 * Chat History Service - Sara Learning Platform
 * Simple, Reliable, Direct Database Access for Single-Topic Architecture
 */

import { createClient } from '@supabase/supabase-js'

// ============ DATABASE CLIENT ============
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Database configuration missing. Check SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.')
  }

  return createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'public' },
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { 'x-application-name': 'sara-chat' } }
  })
}

// ============ CORE CHAT OPERATIONS ============

/**
 * Get chat history as string - Direct database access for single topic
 */
export async function getChatHistoryString(userId, topicId) {
  const client = getSupabaseClient()
  
  console.log(`Fetching chat history: ${userId}/${topicId}`)
  
  try {
    const { data, error } = await client
      .from('chat_sessions')
      .select('messages')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        console.log(`📝 No chat history found - returning empty string`)
        return ''
      }
      throw new Error(`Database error: ${error.message}`)
    }

    const conversationString = data?.messages || ''
    console.log(`Chat history retrieved: ${conversationString.length} characters`)
    
    return conversationString

  } catch (error) {
    console.error(`Failed to get chat history:`, error)
    throw error
  }
}

/**
 * Save a single chat turn (user message + AI response) atomically
 */
export async function saveChatTurn(userId, topicId, userMessage, aiResponse) {
  const client = getSupabaseClient()
  
  console.log(`💾 Saving chat turn: ${userId}/${topicId}`)
  
  try {
    // Get current conversation
    const { data: currentData, error: fetchError } = await client
      .from('chat_sessions')
      .select('messages, message_count')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single()

    let currentConversation = ''
    let currentCount = 0
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(`Failed to fetch current conversation: ${fetchError.message}`)
    }
    
    if (currentData) {
      currentConversation = currentData.messages || ''
      currentCount = currentData.message_count || 0
    }

    // Append new messages
    const newMessages = [
      `USER: ${userMessage.trim()}`,
      `AGENT: ${aiResponse.trim()}`
    ].join('\n')

    const updatedConversation = currentConversation 
      ? `${currentConversation}\n${newMessages}`
      : newMessages

    // Keep only last 50 messages (25 pairs)
    const finalConversation = limitMessages(updatedConversation, 50)
    const finalCount = countMessages(finalConversation)

    // Atomic upsert
    const { error: upsertError } = await client
      .from('chat_sessions')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        messages: finalConversation,
        message_count: finalCount,
        phase: 'session',
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'user_id,topic_id',
        ignoreDuplicates: false 
      })

    if (upsertError) {
      throw new Error(`Failed to save conversation: ${upsertError.message}`)
    }

    console.log(`Chat turn saved: ${finalCount} total messages`)
    
    return { 
      messageCount: finalCount,
      conversationHistory: finalConversation 
    }

  } catch (error) {
    console.error(`Failed to save chat turn:`, error)
    throw error
  }
}

/**
 * Save initial AI message (for session start) - Idempotent
 */
export async function saveInitialMessage(userId, topicId, aiMessage) {
  const client = getSupabaseClient()
  
  console.log(`🚀 Saving initial message: ${userId}/${topicId}`)
  
  try {
    // Check if conversation already exists
    const existingHistory = await getChatHistoryString(userId, topicId)
    
    if (existingHistory && existingHistory.trim().length > 0) {
      console.log(`Conversation already exists - skipping initial message`)
      return { 
        messageCount: countMessages(existingHistory),
        conversationHistory: existingHistory,
        wasCreated: false
      }
    }

    // Create new conversation with initial message
    const initialConversation = `AGENT: ${aiMessage.trim()}`

    const { error } = await client
      .from('chat_sessions')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        messages: initialConversation,
        message_count: 1,
        phase: 'session',
        last_message_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'user_id,topic_id',
        ignoreDuplicates: false 
      })

    if (error) {
      throw new Error(`Failed to save initial message: ${error.message}`)
    }

    console.log(`Initial message saved`)
    
    return { 
      messageCount: 1,
      conversationHistory: initialConversation,
      wasCreated: true
    }

  } catch (error) {
    console.error(`Failed to save initial message:`, error)
    throw error
  }
}

/**
 * Clear chat history for a topic
 */
export async function clearChatHistory(userId, topicId) {
  const client = getSupabaseClient()
  
  console.log(`Clearing chat history: ${userId}/${topicId}`)
  
  try {
    const { error } = await client
      .from('chat_sessions')
      .delete()
      .eq('user_id', userId)
      .eq('topic_id', topicId)

    if (error) {
      throw new Error(`Failed to clear chat history: ${error.message}`)
    }

    console.log(`Chat history cleared`)

  } catch (error) {
    console.error(`Failed to clear chat history:`, error)
    throw error
  }
}

/**
 * Get chat history for a specific phase
 */
export async function getChatHistoryByPhase(userId, topicId, phase) {
  const client = getSupabaseClient()
  
  try {
    const { data, error } = await client
      .from('chat_sessions')
      .select('messages')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .eq('phase', phase)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return ''
      }
      throw new Error(`Database error: ${error.message}`)
    }

    return data?.messages || ''

  } catch (error) {
    console.error(`Failed to get chat history by phase:`, error)
    throw error
  }
}

/**
 * Update chat session phase
 */
export async function updateChatPhase(userId, topicId, phase) {
  const client = getSupabaseClient()
  
  try {
    const { error } = await client
      .from('chat_sessions')
      .update({ 
        phase,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('topic_id', topicId)

    if (error) {
      throw new Error(`Failed to update chat phase: ${error.message}`)
    }

    console.log(`Chat phase updated to: ${phase}`)

  } catch (error) {
    console.error(`Failed to update chat phase:`, error)
    throw error
  }
}

// ============ UTILITY FUNCTIONS ============

/**
 * Limit conversation to last N messages
 */
function limitMessages(conversation, maxMessages) {
  if (!conversation) return ''
  
  const lines = conversation.split('\n')
  const messageStarts = []
  
  // Find all message start positions
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('USER: ') || lines[i].startsWith('AGENT: ')) {
      messageStarts.push(i)
    }
  }
  
  // Keep only last maxMessages
  if (messageStarts.length <= maxMessages) {
    return conversation
  }
  
  const keepFromIndex = messageStarts[messageStarts.length - maxMessages]
  return lines.slice(keepFromIndex).join('\n')
}

/**
 * Count total messages in conversation
 */
function countMessages(conversation) {
  if (!conversation) return 0
  
  const lines = conversation.split('\n')
  let count = 0
  
  for (const line of lines) {
    if (line.startsWith('USER: ') || line.startsWith('AGENT: ')) {
      count++
    }
  }
  
  return count
}
