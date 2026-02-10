#!/usr/bin/env node

/**
 * Server Status Checker
 * Industry-grade server health monitoring
 */

import http from 'http'
import { execSync } from 'child_process'

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m'
}

const log = (message, color = COLORS.RESET) => {
  console.log(`${color}${message}${COLORS.RESET}`)
}

const checkPort = (port, name) => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: port === 5000 ? '/health' : '/',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      log(`✅ ${name} is running on port ${port}`, COLORS.GREEN)
      resolve(true)
    })

    req.on('error', (err) => {
      log(`❌ ${name} is not running on port ${port}`, COLORS.RED)
      log(`   Error: ${err.message}`, COLORS.YELLOW)
      resolve(false)
    })

    req.on('timeout', () => {
      log(`⏱️  ${name} timeout on port ${port}`, COLORS.YELLOW)
      resolve(false)
    })

    req.end()
  })
}

const checkProcesses = () => {
  log('\n🔍 Checking for running Node.js processes...', COLORS.BLUE)
  
  try {
    // Check for Node processes on Windows
    const output = execSync('tasklist /FI "IMAGENAME eq node.exe" /FO CSV', { encoding: 'utf8' })
    const lines = output.split('\n').filter(line => line.includes('node.exe'))
    
    if (lines.length > 1) { // First line is header
      log(`📊 Found ${lines.length - 1} Node.js processes running`, COLORS.GREEN)
      lines.slice(1).forEach((line, index) => {
        const parts = line.split(',')
        if (parts.length > 1) {
          const pid = parts[1].replace(/"/g, '')
          log(`   Process ${index + 1}: PID ${pid}`, COLORS.RESET)
        }
      })
    } else {
      log('📊 No Node.js processes found', COLORS.YELLOW)
    }
  } catch (error) {
    log('⚠️  Could not check processes (this is normal on some systems)', COLORS.YELLOW)
  }
}

const checkEnvironment = () => {
  log('\n🔧 Checking environment configuration...', COLORS.BLUE)
  
  // Check backend .env
  try {
    const fs = await import('fs')
    const backendEnvPath = 'backend/.env'
    
    if (fs.existsSync(backendEnvPath)) {
      log('✅ Backend .env file exists', COLORS.GREEN)
      
      const envContent = fs.readFileSync(backendEnvPath, 'utf8')
      const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'JWT_SECRET']
      
      requiredVars.forEach(varName => {
        if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your_`)) {
          log(`✅ ${varName} is configured`, COLORS.GREEN)
        } else {
          log(`⚠️  ${varName} needs configuration`, COLORS.YELLOW)
        }
      })
    } else {
      log('❌ Backend .env file missing', COLORS.RED)
      log('   Copy backend/.env.example to backend/.env', COLORS.YELLOW)
    }
  } catch (error) {
    log('⚠️  Could not check environment files', COLORS.YELLOW)
  }
}

const main = async () => {
  log('🔍 Sara Learning Platform - Server Status Check', COLORS.BLUE)
  log('=' .repeat(50), COLORS.BLUE)
  
  // Check if servers are running
  const backendRunning = await checkPort(5000, 'Backend API')
  const frontendRunning = await checkPort(5173, 'Frontend Dev Server')
  
  // Check processes
  checkProcesses()
  
  // Check environment
  await checkEnvironment()
  
  // Provide recommendations
  log('\n💡 Recommendations:', COLORS.BLUE)
  
  if (!backendRunning) {
    log('🔧 To start backend:', COLORS.YELLOW)
    log('   cd backend && npm run dev', COLORS.RESET)
    log('   OR double-click: start-backend.bat', COLORS.RESET)
  }
  
  if (!frontendRunning) {
    log('🔧 To start frontend:', COLORS.YELLOW)
    log('   cd frontend && npm run dev', COLORS.RESET)
    log('   OR double-click: start-frontend.bat', COLORS.RESET)
  }
  
  if (!backendRunning && !frontendRunning) {
    log('🚀 To start both servers:', COLORS.YELLOW)
    log('   Double-click: start-sara.bat', COLORS.GREEN)
  }
  
  if (backendRunning && frontendRunning) {
    log('🎉 All servers are running correctly!', COLORS.GREEN)
    log('   Backend: http://localhost:5000', COLORS.RESET)
    log('   Frontend: http://localhost:5173', COLORS.RESET)
  }
}

main().catch(console.error)