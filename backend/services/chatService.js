/**
 * Chat Service - Sara Learning Platform
 * Industry-level chat storage with structured JSON format
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
    global: { headers: { 'x-application-name': 'sara-chat-v2' } }
  })
}

// ============ STRUCTURED CHAT OPERATIONS ============

/**
 * Get chat history as structured messages array
 */
export async function getChatHistory(userId, topicId) {
  const client = getSupabaseClient()
  
  console.log(`🔍 Fetching structured chat history: ${userId}/${topicId}`)
  
  try {
    const { data, error } = await client
      .from('chat_sessions')
      .select('messages, message_count, phase')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        console.log(`📝 No chat history found - returning empty array`)
        return []
      }
      throw new Error(`Database error: ${error.message}`)
    }

    let messages = []
    const rawMessages = data?.messages || ''

    // Handle both old text format and new JSON format
    if (rawMessages) {
      try {
        // Try to parse as JSON first (new format)
        messages = JSON.parse(rawMessages)
        if (!Array.isArray(messages)) {
          throw new Error('Invalid JSON format')
        }
      } catch (jsonError) {
        // Fallback to parsing old text format
        messages = parseTextToMessages(rawMessages)
      }
    }

    console.log(`✅ Chat history retrieved: ${messages.length} messages`)
    return messages

  } catch (error) {
    console.error(`❌ Failed to get chat history:`, error)
    throw error
  }
}

/**
 * Parse old text format to structured messages
 */
function parseTextToMessages(conversationText) {
  if (!conversationText || typeof conversationText !== 'string') {
    return []
  }

  const messages = []
  const lines = conversationText.split('\n')
  let currentMessage = null
  let currentContent = []

  for (const line of lines) {
    if (line.startsWith('USER: ')) {
      // Save previous message if exists
      if (currentMessage && currentContent.length > 0) {
        messages.push({
          role: currentMessage.role,
          content: currentContent.join('\n').trim(),
          timestamp: new Date().toISOString()
        })
      }
      
      currentMessage = { role: 'user' }
      currentContent = [line.substring(6)]
    } else if (line.startsWith('AGENT: ')) {
      // Save previous message if exists
      if (currentMessage && currentContent.length > 0) {
        messages.push({
          role: currentMessage.role,
          content: currentContent.join('\n').trim(),
          timestamp: new Date().toISOString()
        })
      }
      
      currentMessage = { role: 'assistant' }
      currentContent = [line.substring(7)]
    } else if (currentMessage) {
      // Continue current message (preserves multi-line content)
      currentContent.push(line)
    }
  }

  // Don't forget the last message
  if (currentMessage && currentContent.length > 0) {
    messages.push({
      role: currentMessage.role,
      content: currentContent.join('\n').trim(),
      timestamp: new Date().toISOString()
    })
  }

  return messages
}

/**
 * Save a single chat turn with structured format
 */
export async function saveChatTurn(userId, topicId, userMessage, aiResponse, phase = 'session') {
  const client = getSupabaseClient()
  
  console.log(`💾 Saving structured chat turn: ${userId}/${topicId}`)
  
  try {
    // Get current messages
    const currentMessages = await getChatHistory(userId, topicId)
    
    // Add new messages
    const newMessages = [
      {
        role: 'user',
        content: userMessage.trim(),
        timestamp: new Date().toISOString()
      },
      {
        role: 'assistant',
        content: aiResponse.trim(),
        timestamp: new Date().toISOString()
      }
    ]

    const updatedMessages = [...currentMessages, ...newMessages]
    
    // Keep only last 100 messages (50 pairs)
    const trimmedMessages = updatedMessages.slice(-100)
    const messagesJson = JSON.stringify(trimmedMessages, null, 0)

    // Upsert chat session
    const { error } = await client
      .from('chat_sessions')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        messages: messagesJson,
        message_count: trimmedMessages.length,
        phase: phase,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,topic_id'
      })

    if (error) {
      throw new Error(`Failed to save chat turn: ${error.message}`)
    }

    console.log(`✅ Chat turn saved successfully: ${trimmedMessages.length} total messages`)
    return trimmedMessages

  } catch (error) {
    console.error(`❌ Failed to save chat turn:`, error)
    throw error
  }
}

/**
 * Save initial message (welcome message)
 */
export async function saveInitialMessage(userId, topicId, message, phase = 'session') {
  const client = getSupabaseClient()
  
  console.log(`💾 Saving initial message: ${userId}/${topicId}`)
  
  try {
    const initialMessage = {
      role: 'assistant',
      content: message.trim(),
      timestamp: new Date().toISOString()
    }

    const messagesJson = JSON.stringify([initialMessage], null, 0)

    const { error } = await client
      .from('chat_sessions')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        messages: messagesJson,
        message_count: 1,
        phase: phase,
        last_message_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,topic_id'
      })

    if (error) {
      throw new Error(`Failed to save initial message: ${error.message}`)
    }

    console.log(`✅ Initial message saved successfully`)
    return [initialMessage]

  } catch (error) {
    console.error(`❌ Failed to save initial message:`, error)
    throw error
  }
}

/**
 * Clear chat history for a topic
 */
export async function clearChatHistory(userId, topicId) {
  const client = getSupabaseClient()
  
  console.log(`🗑️ Clearing chat history: ${userId}/${topicId}`)
  
  try {
    const { error } = await client
      .from('chat_sessions')
      .delete()
      .eq('user_id', userId)
      .eq('topic_id', topicId)

    if (error) {
      throw new Error(`Failed to clear chat history: ${error.message}`)
    }

    console.log(`✅ Chat history cleared successfully`)

  } catch (error) {
    console.error(`❌ Failed to clear chat history:`, error)
    throw error
  }
}

/**
 * Get chat messages in old string format (for backward compatibility)
 */
export async function getChatHistoryString(userId, topicId) {
  try {
    const messages = await getChatHistory(userId, topicId)
    
    if (messages.length === 0) {
      return ''
    }

    // Convert structured messages back to text format
    const textLines = []
    for (const message of messages) {
      const prefix = message.role === 'user' ? 'USER: ' : 'AGENT: '
      textLines.push(prefix + message.content)
    }

    return textLines.join('\n')

  } catch (error) {
    console.error('Error converting messages to string:', error)
    return ''
  }
}

/**
 * Get recent messages for context
 */
export async function getLastMessages(userId, topicId, count = 10) {
  try {
    const messages = await getChatHistory(userId, topicId)
    return messages.slice(-count)
  } catch (error) {
    console.error('Error getting last messages:', error)
    return []
  }
}

/**
 * Parse history to messages (for compatibility)
 */
export function parseHistoryToMessages(historyString) {
  if (!historyString) return []
  return parseTextToMessages(historyString)
}

export default {
  getChatHistory,
  saveChatTurn,
  saveInitialMessage,
  clearChatHistory,
  getChatHistoryString,
  getLastMessages,
  parseHistoryToMessages
}