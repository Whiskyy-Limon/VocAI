const REQUIRED_VARS = ['MONGODB_URI', 'JWT_SECRET']

function getEnv() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 4000),
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    openaiApiKey: process.env.OPENAI_API_KEY || null,
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  }
}

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key])
  if (missing.length > 0) {
    const err = new Error(`Missing required env vars: ${missing.join(', ')}`)
    err.code = 'ENV_MISSING'
    throw err
  }
}

module.exports = {
  getEnv,
  validateEnv,
}
