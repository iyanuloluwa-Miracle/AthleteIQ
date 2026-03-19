import app from '../app.js'
import { env } from './config/env.js'
import { connectDB } from './config/db.js'
import { logger } from './utils/logger.js'

// ── Process-level exception handlers ───────────────────────────────────────
// These catch errors that escape Express (e.g. async code outside a route
// or a synchronous throw in a module). Without them, the process crashes
// silently with no structured log entry.

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught exception — shutting down', {
    error: err.message,
    stack: err.stack
  })
  // Allow the logger to flush before exiting
  process.exit(1)
})

process.on('unhandledRejection', (reason: unknown) => {
  const message = reason instanceof Error ? reason.message : String(reason)
  const stack = reason instanceof Error ? reason.stack : undefined
  logger.error('Unhandled promise rejection — shutting down', { error: message, stack })
  process.exit(1)
})

// ── Startup ─────────────────────────────────────────────────────────────────
async function start(): Promise<void> {
  await connectDB()

  const server = app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`, {
      env: env.nodeEnv,
      logLevel: env.logLevel
    })
  })

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  // On SIGTERM/SIGINT (PM2, Docker, Kubernetes) stop accepting new connections
  // and wait for in-flight requests to finish before exiting.
  const shutdown = (signal: string) => {
    logger.info(`${signal} received — closing HTTP server gracefully`)
    server.close(() => {
      logger.info('HTTP server closed')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

start().catch((err: Error) => {
  // Use logger so the startup failure appears in the same structured format
  // as all other logs — avoids a plain console.error breaking JSON log pipelines.
  logger.error('Failed to start server', { error: err.message, stack: err.stack })
  process.exit(1)
})
