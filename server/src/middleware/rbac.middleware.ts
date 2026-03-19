import type { Request, Response, NextFunction } from 'express'
import type { IUser } from '../models/User.model.js'
import { AppError } from '../utils/errors.js'

type Role = IUser['role']

/**
 * Restrict access to one or more roles.
 * Usage: router.get('/admin', authenticate, requireRole('admin'), handler)
 */
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user as IUser | undefined
    if (!user) {
      return next(new AppError('Authentication required', 401))
    }
    if (!roles.includes(user.role)) {
      return next(
        new AppError(`Access denied. Required role(s): ${roles.join(', ')}`, 403)
      )
    }
    next()
  }
}

/** Convenience wrappers */
export const adminOnly = requireRole('admin')
export const advisorOrAdmin = requireRole('career_advisor', 'admin')
export const studentAccess = requireRole('student', 'career_advisor', 'admin')
