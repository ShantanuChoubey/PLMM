import { PrismaClient } from '@prisma/client'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'

// Limit pool size to avoid exhausting Neon's free-tier connection limit (max 10).
// connection_limit=5 keeps well within budget across concurrent requests.
const connectionUrl =
  env.databaseUrl +
  (env.databaseUrl.includes('?') ? '&' : '?') +
  'connection_limit=5&pool_timeout=30'

const prisma = new PrismaClient({
  log: env.isDevelopment ? ['warn', 'error'] : ['error'],
  datasources: {
    db: { url: connectionUrl },
  },
})

let isConnected = false

export async function connectDatabase() {
  try {
    await prisma.$connect()
    isConnected = true
    logger.info('Database connected successfully')
    return prisma
  } catch (error) {
    if (env.isDevelopment) {
      logger.warn(
        'Database connection failed — running without DB. Set a valid Neon DATABASE_URL in .env',
        error.message,
      )
      isConnected = false
      return prisma
    }
    throw error
  }
}

export async function disconnectDatabase() {
  if (!isConnected) return
  await prisma.$disconnect()
  isConnected = false
  logger.info('Database disconnected')
}

export function getDatabaseStatus() {
  return isConnected
}

export { prisma }
