import mongoose from 'mongoose'
import { env } from './env.js'
import { logger } from '../utils/logger.js'

// ── Connection lifecycle events ─────────────────────────────────────────────
// Registered once at module load so they persist across reconnect cycles.
// These are essential in production to detect and alert on DB outages.

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected', { uri: redactedUri(env.mongoUri) })
})

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected — waiting for reconnect')
})

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected')
})

mongoose.connection.on('error', (err: Error) => {
  logger.error('MongoDB connection error', { error: err.message })
})

/**
 * Redact credentials from the connection URI for safe logging.
 * mongodb+srv://user:password@cluster → mongodb+srv://***@cluster
 */
function redactedUri(uri: string): string {
  try {
    const parsed = new URL(uri)
    if (parsed.password) parsed.password = '***'
    if (parsed.username) parsed.username = '***'
    return parsed.toString()
  } catch {
    return '[unparseable URI]'
  }
}

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri)
    // The 'connected' event above logs the success; no duplicate log needed here.
  } catch (err) {
    logger.error('MongoDB initial connection failed', {
      error: (err as Error).message,
      uri: redactedUri(env.mongoUri)
    })
    process.exit(1)
  }
}
