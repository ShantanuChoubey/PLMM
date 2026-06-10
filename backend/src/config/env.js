import dotenv from 'dotenv'
import { MESSAGES } from '../constants/messages.js'

dotenv.config()

const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'CLIENT_URL',
]

function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]?.trim())

  if (missing.length > 0) {
    throw new Error(`${MESSAGES.ENV_VALIDATION_FAILED}: missing ${missing.join(', ')}`)
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error(`${MESSAGES.ENV_VALIDATION_FAILED}: JWT_SECRET must be at least 32 characters`)
  }
}

validateEnv()

export const env = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  clientUrl: process.env.CLIENT_URL,
}
