import app from './app.js'
import { env } from './config/env.js'
import { connectDatabase, disconnectDatabase } from './database/prisma.js'
import { logger } from './utils/logger.js'

async function startServer() {
  try {
    await connectDatabase()

    const server = app.listen(env.port, () => {
      logger.info(`PLMM API running in ${env.nodeEnv} mode on port ${env.port}`)
      logger.info(`Health check: http://localhost:${env.port}/api/v1/health`)
    })

    const shutdown = async (signal) => {
      logger.warn(`${signal} received. Shutting down gracefully...`)
      server.close(async () => {
        await disconnectDatabase()
        process.exit(0)
      })
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection', reason)
    })

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', error)
      process.exit(1)
    })
  } catch (error) {
    logger.error('Failed to start server', error.message)
    process.exit(1)
  }
}

startServer()
