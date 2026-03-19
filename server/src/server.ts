import app from '../app.js'
import { env } from './config/env.js'
import { connectDB } from './config/db.js'
import { logger } from './utils/logger.js'

async function start(): Promise<void> {
  await connectDB()
  app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port} [${env.nodeEnv}]`)
  })
}

start().catch((err: Error) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
