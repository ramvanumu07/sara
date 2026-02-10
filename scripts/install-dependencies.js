#!/usr/bin/env node

/**
 * Industry-Grade Dependency Installation Script
 * Handles all edge cases and provides comprehensive error handling
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

const execCommand = (command, cwd) => {
  try {
    log(`Executing: ${command}`, COLORS.BLUE)
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      timeout: 300000 // 5 minutes timeout
    })
    return true
  } catch (error) {
    log(`❌ Command failed: ${command}`, COLORS.RED)
    log(`Error: ${error.message}`, COLORS.RED)
    return false
  }
}

const checkNodeVersion = () => {
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])
  
  if (majorVersion < 18) {
    log(`❌ Node.js version ${nodeVersion} is not supported. Please upgrade to Node.js 18 or higher.`, COLORS.RED)
    process.exit(1)
  }
  
  log(`✅ Node.js version ${nodeVersion} is supported`, COLORS.GREEN)
}

const checkPackageManager = () => {
  try {
    execSync('npm --version', { stdio: 'ignore' })
    log('✅ npm is available', COLORS.GREEN)
    return 'npm'
  } catch (error) {
    try {
      execSync('yarn --version', { stdio: 'ignore' })
      log('✅ yarn is available', COLORS.GREEN)
      return 'yarn'
    } catch (error) {
      log('❌ Neither npm nor yarn is available', COLORS.RED)
      process.exit(1)
    }
  }
}

const createDirectories = () => {
  const dirs = [
    'backend/logs',
    'backend/coverage',
    'frontend/coverage',
    'docs'
  ]
  
  dirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir)
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true })
      log(`✅ Created directory: ${dir}`, COLORS.GREEN)
    }
  })
}

const installBackendDependencies = (packageManager) => {
  log('📦 Installing backend dependencies...', COLORS.YELLOW)
  
  const backendPath = path.join(process.cwd(), 'backend')
  if (!fs.existsSync(backendPath)) {
    log('❌ Backend directory not found', COLORS.RED)
    return false
  }
  
  // Check if package.json exists
  const packageJsonPath = path.join(backendPath, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ Backend package.json not found', COLORS.RED)
    return false
  }
  
  // Install dependencies
  const installCommand = packageManager === 'yarn' ? 'yarn install' : 'npm install'
  const success = execCommand(installCommand, backendPath)
  
  if (success) {
    log('✅ Backend dependencies installed successfully', COLORS.GREEN)
  }
  
  return success
}

const installFrontendDependencies = (packageManager) => {
  log('📦 Installing frontend dependencies...', COLORS.YELLOW)
  
  const frontendPath = path.join(process.cwd(), 'frontend')
  if (!fs.existsSync(frontendPath)) {
    log('❌ Frontend directory not found', COLORS.RED)
    return false
  }
  
  // Check if package.json exists
  const packageJsonPath = path.join(frontendPath, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ Frontend package.json not found', COLORS.RED)
    return false
  }
  
  // Install dependencies
  const installCommand = packageManager === 'yarn' ? 'yarn install' : 'npm install'
  const success = execCommand(installCommand, frontendPath)
  
  if (success) {
    log('✅ Frontend dependencies installed successfully', COLORS.GREEN)
  }
  
  return success
}

const verifyInstallation = () => {
  log('🔍 Verifying installation...', COLORS.YELLOW)
  
  const criticalPackages = {
    backend: [
      '@sentry/node',
      'ioredis', 
      'winston',
      'express',
      'jsonwebtoken'
    ],
    frontend: [
      '@sentry/react',
      '@testing-library/react',
      'react',
      'axios'
    ]
  }
  
  let allGood = true
  
  // Check backend packages
  Object.entries(criticalPackages).forEach(([project, packages]) => {
    const projectPath = path.join(process.cwd(), project)
    const nodeModulesPath = path.join(projectPath, 'node_modules')
    
    if (!fs.existsSync(nodeModulesPath)) {
      log(`❌ ${project} node_modules not found`, COLORS.RED)
      allGood = false
      return
    }
    
    packages.forEach(pkg => {
      const pkgPath = path.join(nodeModulesPath, pkg)
      if (fs.existsSync(pkgPath)) {
        log(`✅ ${project}/${pkg} installed`, COLORS.GREEN)
      } else {
        log(`⚠️  ${project}/${pkg} not found (will use fallback)`, COLORS.YELLOW)
      }
    })
  })
  
  return allGood
}

const runTests = (packageManager) => {
  log('🧪 Running tests to verify installation...', COLORS.YELLOW)
  
  // Test backend
  const backendPath = path.join(process.cwd(), 'backend')
  const testCommand = packageManager === 'yarn' ? 'yarn test' : 'npm test'
  
  log('Testing backend...', COLORS.BLUE)
  const backendTestSuccess = execCommand(testCommand, backendPath)
  
  // Test frontend
  const frontendPath = path.join(process.cwd(), 'frontend')
  log('Testing frontend...', COLORS.BLUE)
  const frontendTestSuccess = execCommand(testCommand, frontendPath)
  
  return backendTestSuccess && frontendTestSuccess
}

const createEnvironmentFiles = () => {
  log('📝 Checking environment files...', COLORS.YELLOW)
  
  const envFiles = [
    {
      path: 'backend/.env.example',
      content: `# Sara Learning Platform - Backend Environment Variables
NODE_ENV=development
PORT=5000

# Database
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# JWT
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
SESSION_TIMEOUT_HOURS=24

# Redis (optional - will use memory cache if not provided)
REDIS_URL=redis://localhost:6379

# Sentry (optional - error tracking)
SENTRY_DSN=your_sentry_dsn_here

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# AI (optional)
GROQ_API_KEY=your_groq_api_key_here

# Security
BCRYPT_ROUNDS=12
LOG_LEVEL=info`
    },
    {
      path: 'frontend/.env.example',
      content: `# Sara Learning Platform - Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:5000
VITE_SENTRY_DSN=your_frontend_sentry_dsn_here`
    }
  ]
  
  envFiles.forEach(({ path: filePath, content }) => {
    const fullPath = path.join(process.cwd(), filePath)
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, content)
      log(`✅ Created ${filePath}`, COLORS.GREEN)
    }
  })
}

const main = async () => {
  log('🚀 Sara Learning Platform - Industry-Grade Installation', COLORS.BLUE)
  log('=' .repeat(60), COLORS.BLUE)
  
  try {
    // Pre-installation checks
    checkNodeVersion()
    const packageManager = checkPackageManager()
    createDirectories()
    createEnvironmentFiles()
    
    // Install dependencies
    const backendSuccess = installBackendDependencies(packageManager)
    const frontendSuccess = installFrontendDependencies(packageManager)
    
    if (!backendSuccess || !frontendSuccess) {
      log('❌ Installation failed. Please check the errors above.', COLORS.RED)
      process.exit(1)
    }
    
    // Verify installation
    verifyInstallation()
    
    // Success message
    log('=' .repeat(60), COLORS.GREEN)
    log('🎉 Installation completed successfully!', COLORS.GREEN)
    log('=' .repeat(60), COLORS.GREEN)
    
    log('\n📋 Next steps:', COLORS.YELLOW)
    log('1. Copy .env.example to .env in both backend and frontend directories', COLORS.RESET)
    log('2. Update environment variables with your actual values', COLORS.RESET)
    log('3. Start Redis server (optional, will use memory cache if not available)', COLORS.RESET)
    log('4. Run: cd backend && npm run dev', COLORS.RESET)
    log('5. Run: cd frontend && npm run dev', COLORS.RESET)
    
    log('\n🔧 Optional services:', COLORS.YELLOW)
    log('- Set up Sentry for error tracking', COLORS.RESET)
    log('- Configure Redis for production caching', COLORS.RESET)
    log('- Set up email service for notifications', COLORS.RESET)
    
  } catch (error) {
    log(`❌ Installation failed with error: ${error.message}`, COLORS.RED)
    process.exit(1)
  }
}

// Run the installation
main()