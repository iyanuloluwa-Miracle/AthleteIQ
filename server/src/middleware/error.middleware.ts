import type { Request, Response, NextFunction } from 'express'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'
import { AppError } from '../utils/errors.js'

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const isOperational = err instanceof AppError ? err.isOperational : false
  const message = isOperational ? err.message : 'Internal server error'

  if (!isOperational) {
    logger.error(err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.isDev && !isOperational && { stack: err.stack })
  })
}

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  const err = new AppError('Route not found', 404)
  next(err)
}
