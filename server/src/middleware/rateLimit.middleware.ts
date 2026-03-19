import rateLimit from 'express-rate-limit'
import type { Request, Response } from 'express'
import { logger } from '../utils/logger.js'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
  handler(req: Request, res: Response) {
    logger.warn('Rate limit exceeded', {
      requestId: req.id,
      ip: req.ip,
      method: req.method,
      url: req.originalUrl
    })
    res.status(429).json({ success: false, message: 'Too many requests, please try again later' })
  }
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
  handler(req: Request, res: Response) {
    // Auth rate limit hits are a potential brute-force signal — log them clearly
    logger.warn('Auth rate limit exceeded — possible brute force attempt', {
      requestId: req.id,
      ip: req.ip,
      url: req.originalUrl
    })
    res.status(429).json({ success: false, message: 'Too many auth attempts, please try again later' })
  }
})
