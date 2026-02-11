// Environment variable validation
// Fails fast at startup if required variables are missing

const REQUIRED_VARS = [
  'JWT_SECRET',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'GROQ_API_KEY'
]

const OPTIONAL_VARS = {
  PORT: '3001',
  FRONTEND_URL: 'http://localhost:5173'
}

export function validateEnv() {
  const missing = []

  for (const varName of REQUIRED_VARS) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    console.error('\n╔════════════════════════════════════════════╗')
    console.error('║  MISSING REQUIRED ENVIRONMENT VARIABLES  ║')
    console.error('╠════════════════════════════════════════════╣')
    for (const varName of missing) {
      console.error(`║  - ${varName.padEnd(38)}║`)
    }
    console.error('╠════════════════════════════════════════════╣')
    console.error('║  Create a .env file with these variables   ║')
    console.error('║  See .env.example for reference            ║')
    console.error('╚════════════════════════════════════════════╝\n')
    process.exit(1)
  }

  // Set defaults for optional vars
  for (const [varName, defaultValue] of Object.entries(OPTIONAL_VARS)) {
    if (!process.env[varName]) {
      process.env[varName] = defaultValue
    }
  }

  return true
}

export const config = {
  get port() { return process.env.PORT },
  get frontendUrl() { return process.env.FRONTEND_URL },
  get jwtSecret() { return process.env.JWT_SECRET },
  get supabaseUrl() { return process.env.SUPABASE_URL },
  get supabaseKey() { return process.env.SUPABASE_SERVICE_KEY },
  get groqApiKey() { return process.env.GROQ_API_KEY }
}










