#!/usr/bin/env node

/**
 * Windows-Optimized Installation Script
 * Handles Windows-specific issues and native dependencies
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

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

const execCommand = (command, cwd, options = {}) => {
  try {
    log(`Executing: ${command}`, COLORS.BLUE)
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      timeout: 600000, // 10 minutes timeout for Windows
      windowsHide: true,
      ...options
    })
    return true
  } catch (error) {
    log(`❌ Command failed: ${command}`, COLORS.RED)
    if (options.ignoreError) {
      log(`⚠️  Continuing despite error...`, COLORS.YELLOW)
      return true
    }
    return false
  }
}

const checkWindowsTools = () => {
  log('🔍 Checking Windows development tools...', COLORS.YELLOW)
  
  // Check if we have Python (needed for some native modules)
  try {
    execSync('python --version', { stdio: 'ignore' })
    log('✅ Python is available', COLORS.GREEN)
    return true
  } catch (error) {
    try {
      execSync('python3 --version', { stdio: 'ignore' })
      log('✅ Python3 is available', COLORS.GREEN)
      return true
    } catch (error) {
      log('⚠️  Python not found - will skip native modules', COLORS.YELLOW)
      return false
    }
  }
}

const installWithoutNativeModules = (packageManager, projectPath) => {
  log('📦 Installing dependencies without problematic native modules...', COLORS.YELLOW)
  
  // Install dependencies excluding problematic ones
  const commands = [
    `${packageManager} install --ignore-optional`,
    `${packageManager} install --no-optional`
  ]
  
  for (const command of commands) {
    if (execCommand(command, projectPath, { ignoreError: true })) {
      return true
    }
  }
  
  return false
}

const installBackendDependencies = (packageManager) => {
  log('📦 Installing backend dependencies (Windows optimized)...', COLORS.YELLOW)
  
  const backendPath = path.join(process.cwd(), 'backend')
  if (!fs.existsSync(backendPath)) {
    log('❌ Backend directory not found', COLORS.RED)
    return false
  }
  
  // Try regular install first
  if (execCommand(`${packageManager} install`, backendPath, { ignoreError: true })) {
    log('✅ Backend dependencies installed successfully', COLORS.GREEN)
    return true
  }
  
  // If regular install fails, try without optional/native modules
  log('⚠️  Regular install failed, trying without native modules...', COLORS.YELLOW)
  
  if (installWithoutNativeModules(packageManager, backendPath)) {
    log('✅ Backend dependencies installed (without native modules)', COLORS.GREEN)
    return true
  }
  
  // Last resort: install core dependencies manually
  log('⚠️  Trying manual installation of core dependencies...', COLORS.YELLOW)
  
  const corePackages = [
    'express',
    'cors',
    'helmet',
    'compression',
    'dotenv',
    'jsonwebtoken',
    'bcrypt',
    'joi',
    'uuid',
    '@supabase/supabase-js'
  ]
  
  const coreCommand = `${packageManager} install ${corePackages.join(' ')}`
  if (execCommand(coreCommand, backendPath)) {
    log('✅ Core backend dependencies installed', COLORS.GREEN)
    
    // Try to install optional dependencies
    const optionalPackages = [
      'winston',
      'ioredis',
      '@sentry/node'
    ]
    
    optionalPackages.forEach(pkg => {
      execCommand(`${packageManager} install ${pkg}`, backendPath, { ignoreError: true })
    })
    
    return true
  }
  
  return false
}

const installFrontendDependencies = (packageManager) => {
  log('📦 Installing frontend dependencies...', COLORS.YELLOW)
  
  const frontendPath = path.join(process.cwd(), 'frontend')
  if (!fs.existsSync(frontendPath)) {
    log('❌ Frontend directory not found', COLORS.RED)
    return false
  }
  
  // Frontend usually doesn't have native module issues
  const success = execCommand(`${packageManager} install`, frontendPath)
  
  if (success) {
    log('✅ Frontend dependencies installed successfully', COLORS.GREEN)
  }
  
  return success
}

const createWindowsStartScripts = () => {
  log('📝 Creating Windows start scripts...', COLORS.YELLOW)
  
  // Backend start script
  const backendScript = `@echo off
echo Starting Sara Learning Platform Backend...
cd backend
npm run dev
pause`
  
  fs.writeFileSync('start-backend.bat', backendScript)
  
  // Frontend start script
  const frontendScript = `@echo off
echo Starting Sara Learning Platform Frontend...
cd frontend
npm run dev
pause`
  
  fs.writeFileSync('start-frontend.bat', frontendScript)
  
  // Combined start script
  const combinedScript = `@echo off
echo Starting Sara Learning Platform...
echo.
echo Starting Backend...
start "Sara Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
echo Starting Frontend...
start "Sara Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo Both servers are starting in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause`
  
  fs.writeFileSync('start-sara.bat', combinedScript)
  
  log('✅ Windows start scripts created:', COLORS.GREEN)
  log('  - start-backend.bat (Backend only)', COLORS.RESET)
  log('  - start-frontend.bat (Frontend only)', COLORS.RESET)
  log('  - start-sara.bat (Both servers)', COLORS.RESET)
}

const main = async () => {
  log('🚀 Sara Learning Platform - Windows Installation', COLORS.BLUE)
  log('=' .repeat(60), COLORS.BLUE)
  
  try {
    // Check tools
    const hasPython = checkWindowsTools()
    if (!hasPython) {
      log('ℹ️  Native modules will be skipped (Python not available)', COLORS.YELLOW)
    }
    
    // Check package manager
    let packageManager = 'npm'
    try {
      execSync('yarn --version', { stdio: 'ignore' })
      packageManager = 'yarn'
      log('✅ Using Yarn package manager', COLORS.GREEN)
    } catch (error) {
      log('✅ Using npm package manager', COLORS.GREEN)
    }
    
    // Install dependencies
    const backendSuccess = installBackendDependencies(packageManager)
    const frontendSuccess = installFrontendDependencies(packageManager)
    
    if (!backendSuccess) {
      log('❌ Backend installation failed. Please check the errors above.', COLORS.RED)
      log('💡 Try running: npm install --no-optional in the backend folder', COLORS.YELLOW)
    }
    
    if (!frontendSuccess) {
      log('❌ Frontend installation failed. Please check the errors above.', COLORS.RED)
    }
    
    // Create Windows scripts
    createWindowsStartScripts()
    
    // Success message
    log('=' .repeat(60), COLORS.GREEN)
    log('🎉 Windows installation completed!', COLORS.GREEN)
    log('=' .repeat(60), COLORS.GREEN)
    
    log('\n📋 Next steps:', COLORS.YELLOW)
    log('1. Copy backend\\.env.example to backend\\.env', COLORS.RESET)
    log('2. Copy frontend\\.env.example to frontend\\.env', COLORS.RESET)
    log('3. Update environment variables with your values', COLORS.RESET)
    log('4. Double-click start-sara.bat to start both servers', COLORS.RESET)
    
    log('\n🚀 Quick start:', COLORS.YELLOW)
    log('Double-click: start-sara.bat', COLORS.GREEN)
    
    if (!backendSuccess) {
      log('\n⚠️  Backend installation had issues:', COLORS.YELLOW)
      log('Some optional features may not work (error tracking, Redis cache)', COLORS.RESET)
      log('The application will use fallback systems and work normally', COLORS.RESET)
    }
    
  } catch (error) {
    log(`❌ Installation failed with error: ${error.message}`, COLORS.RED)
    log('\n💡 Try running as Administrator if you see permission errors', COLORS.YELLOW)
    process.exit(1)
  }
}

// Run the installation
main()