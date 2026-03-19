import winston from 'winston'
import path from 'path'
import fs from 'fs'
import { env } from '../config/env.js'

// ── Log directory (file transports only in production) ─────────────────────
const LOG_DIR = path.resolve('logs')
if (!env.isDev && !fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true })
}

// ── Format helpers ─────────────────────────────────────────────────────────
const { combine, timestamp, errors, json, colorize, printf } = winston.format

/**
 * Development: single-line, colorised, with all extra metadata printed inline.
 * Example:
 *   12:34:56 [info]: Server running on port 3000 {"env":"development"}
 */
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, service: _s, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
    return stack
      ? `${timestamp} [${level}]: ${message}${metaStr}\n${stack}`
      : `${timestamp} [${level}]: ${message}${metaStr}`
  })
)

/**
 * Production: structured JSON — parseable by Datadog, Logtail, AWS CloudWatch, etc.
 * Example:
 *   {"level":"error","message":"...","service":"athleteiq-api","timestamp":"...","stack":"..."}
 */
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
)

// ── Transports ─────────────────────────────────────────────────────────────
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: env.isDev ? devFormat : prodFormat,
    // Silence console during tests to keep output clean
    silent: env.nodeEnv === 'test'
  })
]

if (!env.isDev) {
  // Error-only log — smaller, easier to alert on
  transports.push(
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'error.log'),
      level: 'error',
      format: prodFormat,
      maxsize: 10 * 1024 * 1024, // 10 MB per file
      maxFiles: 5                  // keep last 5 rotated files
    })
  )

  // Combined log — all levels for full audit trail
  transports.push(
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'combined.log'),
      format: prodFormat,
      maxsize: 20 * 1024 * 1024, // 20 MB per file
      maxFiles: 14                // ~2 weeks of daily files at typical volume
    })
  )
}

// ── Logger instance ────────────────────────────────────────────────────────
export const logger = winston.createLogger({
  /**
   * Level is driven by LOG_LEVEL env var (default: 'info' in production, 'debug' in dev).
   * npm levels: error(0) warn(1) info(2) http(3) verbose(4) debug(5) silly(6)
   */
  level: env.logLevel,
  levels: winston.config.npm.levels,
  defaultMeta: { service: 'athleteiq-api', env: env.nodeEnv },
  transports,
  // Do not let Winston call process.exit() — we handle that explicitly
  exitOnError: false
})

/**
 * Stream adapter for Morgan HTTP request logging.
 * Morgan writes a newline-terminated string; we trim it and log at 'http' level
 * so it flows through Winston and lands in both console and file transports.
 */
export const morganStream = {
  write: (message: string): void => {
    logger.http(message.trim())
  }
}
