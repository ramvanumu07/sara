/**
 * AI Service - Industry Level
 * Professional AI operations with proper error handling and streaming
 */

import Groq from 'groq-sdk'

// ============ GROQ CLIENT ============
let groq = null

function initializeAI() {
  if (groq) return groq

  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    throw new Error('AI configuration missing. Check GROQ_API_KEY environment variable.')
  }

  try {
    groq = new Groq({ apiKey })
    console.log(`[${new Date().toISOString()}] ✅ AI service connected`)
    return groq
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ AI service connection failed:`, error)
    throw error
  }
}

// ============ AI OPERATIONS ============

export async function callAI(messages, maxTokens = 1000, temperature = 0.5, model = 'llama-3.3-70b-versatile') {
  try {
    const client = initializeAI()
    
    const completion = await client.chat.completions.create({
      messages,
      model,
      max_tokens: maxTokens,
      temperature,
      top_p: 0.9,
      stream: true
    })

    // Handle streaming response
    let fullResponse = ''
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || ''
      fullResponse += content
    }

    if (!fullResponse.trim()) {
      throw new Error('Empty response from AI service')
    }

    return fullResponse.trim()
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ AI API Error:`, error)
    
    // Return user-friendly error message
    if (error.message.includes('rate limit')) {
      throw new Error('AI service is busy. Please try again in a moment.')
    } else if (error.message.includes('quota')) {
      throw new Error('AI service quota exceeded. Please contact support.')
    } else {
      throw new Error('AI service temporarily unavailable. Please try again.')
    }
  }
}

// Export for health checks
export const getAIClient = () => initializeAI()