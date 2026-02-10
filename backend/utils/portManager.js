/**
 * Port Management Utility - Industry Grade
 * Handles port conflicts and provides fallback ports
 */

import net from 'net'

/**
 * Check if a port is available
 * @param {number} port - Port to check
 * @returns {Promise<boolean>} - True if port is available
 */
export const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer()
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true)
      })
      server.close()
    })
    
    server.on('error', () => {
      resolve(false)
    })
  })
}

/**
 * Find an available port starting from a base port
 * @param {number} startPort - Starting port to check
 * @param {number} maxAttempts - Maximum number of ports to try
 * @returns {Promise<number>} - Available port number
 */
export const findAvailablePort = async (startPort = 5000, maxAttempts = 10) => {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i
    const available = await isPortAvailable(port)
    
    if (available) {
      return port
    }
  }
  
  throw new Error(`No available port found in range ${startPort}-${startPort + maxAttempts - 1}`)
}

/**
 * Kill process using a specific port (Windows)
 * @param {number} port - Port to free up
 * @returns {Promise<boolean>} - True if successful
 */
export const killProcessOnPort = async (port) => {
  try {
    const { execSync } = await import('child_process')
    
    // Find process using the port
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' })
    const lines = output.split('\n').filter(line => line.includes('LISTENING'))
    
    if (lines.length === 0) {
      return true // No process using the port
    }
    
    // Extract PID from the first listening process
    const pidMatch = lines[0].trim().split(/\s+/).pop()
    const pid = parseInt(pidMatch)
    
    if (isNaN(pid)) {
      return false
    }
    
    // Kill the process
    execSync(`taskkill /PID ${pid} /F`, { encoding: 'utf8' })
    console.log(`✅ Killed process ${pid} using port ${port}`)
    
    // Wait a bit for the port to be freed
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return true
  } catch (error) {
    console.warn(`⚠️  Could not kill process on port ${port}:`, error.message)
    return false
  }
}

/**
 * Get a safe port for the application
 * @param {number} preferredPort - Preferred port number
 * @param {boolean} killExisting - Whether to try killing existing process
 * @returns {Promise<number>} - Safe port to use
 */
export const getSafePort = async (preferredPort = 5000, killExisting = false) => {
  // First, check if preferred port is available
  const available = await isPortAvailable(preferredPort)
  
  if (available) {
    return preferredPort
  }
  
  console.warn(`⚠️  Port ${preferredPort} is in use`)
  
  // Try to kill existing process if requested
  if (killExisting) {
    console.log(`🔄 Attempting to free port ${preferredPort}...`)
    const killed = await killProcessOnPort(preferredPort)
    
    if (killed) {
      const nowAvailable = await isPortAvailable(preferredPort)
      if (nowAvailable) {
        console.log(`✅ Port ${preferredPort} is now available`)
        return preferredPort
      }
    }
  }
  
  // Find alternative port
  console.log(`🔍 Finding alternative port...`)
  const alternativePort = await findAvailablePort(preferredPort + 1)
  console.log(`✅ Using port ${alternativePort} instead`)
  
  return alternativePort
}

export default {
  isPortAvailable,
  findAvailablePort,
  killProcessOnPort,
  getSafePort
}