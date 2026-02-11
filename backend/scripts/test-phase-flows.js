#!/usr/bin/env node

/**
 * Test Phase Flow Logic
 * Tests the three main flows:
 * 1. Session incomplete → Resume session
 * 2. Session complete → Go to playtime  
 * 3. Playtime complete → Go to assignments
 */

import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

// Database client
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing database configuration')
    process.exit(1)
  }

  return createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'public' },
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

// Test scenarios
const testScenarios = [
  {
    name: 'Session Incomplete → Resume Session',
    progress: {
      phase: 'session',
      status: 'in_progress'
    },
    expectedResult: {
      targetPhase: 'session',
      targetUrl: '/learn/console-log'
    }
  },
  {
    name: 'Session Complete → Go to Playtime',
    progress: {
      phase: 'session', 
      status: 'completed'
    },
    expectedResult: {
      targetPhase: 'playtime',
      targetUrl: '/learn/console-log?phase=playtime'
    }
  },
  {
    name: 'Playtime Complete → Go to Assignments',
    progress: {
      phase: 'playtime',
      status: 'completed'
    },
    expectedResult: {
      targetPhase: 'assignment', 
      targetUrl: '/learn/console-log?phase=assignment'
    }
  },
  {
    name: 'Playtime Incomplete → Continue Playtime',
    progress: {
      phase: 'playtime',
      status: 'in_progress'
    },
    expectedResult: {
      targetPhase: 'playtime',
      targetUrl: '/learn/console-log?phase=playtime'
    }
  },
  {
    name: 'Assignment Phase → Continue Assignment',
    progress: {
      phase: 'assignment',
      status: 'in_progress'
    },
    expectedResult: {
      targetPhase: 'assignment',
      targetUrl: '/learn/console-log?phase=assignment'
    }
  }
]

// Simulate Dashboard logic
function simulateDashboardLogic(recentTopic) {
  const topicId = recentTopic.topic_id
  const phase = recentTopic.phase
  const status = recentTopic.status
  
  let targetPhase = 'session'
  let targetUrl = `/learn/${topicId}`

  console.log('Progress Debug:', {
    phase: recentTopic.phase,
    status: recentTopic.status
  })

  // DASHBOARD LOGIC (from Dashboard.jsx)
  if (phase === 'session' && status === 'completed') {
    // Session completed → Go to playtime
    targetPhase = 'playtime'
    targetUrl = `/learn/${topicId}?phase=playtime`
    console.log('Session completed -> Redirecting to playtime')
  } else if (phase === 'playtime' && status === 'completed') {
    // Playtime completed → Go to assignments
    targetPhase = 'assignment'
    targetUrl = `/learn/${topicId}?phase=assignment`
    console.log('Playtime completed -> Redirecting to assignments')
  } else if (phase === 'playtime' && status === 'in_progress') {
    // User is in playtime → Continue playtime
    targetPhase = 'playtime'
    targetUrl = `/learn/${topicId}?phase=playtime`
    console.log('User in playtime -> Continue playtime')
  } else if (phase === 'assignment') {
    // User is in assignments → Continue assignment
    targetPhase = 'assignment'
    targetUrl = `/learn/${topicId}?phase=assignment`
    console.log('User in assignments -> Continue assignment')
  } else if (phase === 'session' && status === 'in_progress') {
    // Session in progress → Continue session
    targetPhase = 'session'
    targetUrl = `/learn/${topicId}`
    console.log('Session in progress -> Continue session')
  } else {
    // Default fallback
    targetPhase = phase || 'session'
    targetUrl = phase === 'playtime' ? `/learn/${topicId}?phase=playtime` : 
               phase === 'assignment' ? `/learn/${topicId}?phase=assignment` : 
               `/learn/${topicId}`
    console.log(`Fallback -> Continue current phase: ${targetPhase}`)
  }

  return { targetPhase, targetUrl }
}

// Run tests
async function runTests() {
  console.log('🧪 Testing Phase Flow Logic\n')
  
  let passed = 0
  let failed = 0
  
  for (const scenario of testScenarios) {
    console.log(`\n📋 Test: ${scenario.name}`)
    console.log(`   Input: phase=${scenario.progress.phase}, status=${scenario.progress.status}`)
    
    // Create mock progress object
    const mockProgress = {
      topic_id: 'console-log',
      user_id: 'test-user',
      ...scenario.progress,
      updated_at: new Date().toISOString()
    }
    
    // Run the logic
    const result = simulateDashboardLogic(mockProgress)
    
    // Check results
    const expectedPhase = scenario.expectedResult.targetPhase
    const expectedUrl = scenario.expectedResult.targetUrl
    
    const phaseMatch = result.targetPhase === expectedPhase
    const urlMatch = result.targetUrl === expectedUrl
    
    if (phaseMatch && urlMatch) {
      console.log(`   PASS`)
      console.log(`      → Phase: ${result.targetPhase} (expected: ${expectedPhase})`)
      console.log(`      → URL: ${result.targetUrl} (expected: ${expectedUrl})`)
      passed++
    } else {
      console.log(`   FAIL`)
      console.log(`      → Phase: ${result.targetPhase} (expected: ${expectedPhase}) ${phaseMatch ? 'PASS' : 'FAIL'}`)
      console.log(`      → URL: ${result.targetUrl} (expected: ${expectedUrl}) ${urlMatch ? 'PASS' : 'FAIL'}`)
      failed++
    }
  }
  
  console.log(`\nTest Results:`)
  console.log(`   Passed: ${passed}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`)
  
  if (failed === 0) {
    console.log(`\nAll tests passed! Phase flow logic is working correctly.`)
  } else {
    console.log(`\nSome tests failed. Please review the logic.`)
  }
}

// Test database integration
async function testDatabaseIntegration() {
  console.log('\nTesting Database Integration...')
  
  try {
    const client = getSupabaseClient()
    
    // Test basic connection
    const { data: testData, error: testError } = await client
      .from('progress')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.log('Database connection failed:', testError.message)
      return
    }
    
    console.log('Database connection: OK')
    
    // Test progress table structure
    if (testData && testData.length > 0) {
      const progress = testData[0]
      console.log('Progress table structure:')
      console.log(`   - Has phase field: ${progress.hasOwnProperty('phase') ? 'yes' : 'no'}`)
      console.log(`   - Has status field: ${progress.hasOwnProperty('status') ? 'yes' : 'no'}`)
      console.log(`   - Sample record:`, {
        topic_id: progress.topic_id,
        phase: progress.phase,
        status: progress.status
      })
    } else {
      console.log('No progress records found in database')
    }
    
  } catch (error) {
    console.error('Database integration test failed:', error.message)
  }
}

// Main function
async function main() {
  console.log('🚀 Phase Flow Testing Suite\n')
  
  // Run logic tests
  await runTests()
  
  // Test database integration
  await testDatabaseIntegration()
  
  console.log('\n✨ Testing complete!')
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
} else {
  // Always run for testing
  main().catch(console.error)
}

export { simulateDashboardLogic, testScenarios }