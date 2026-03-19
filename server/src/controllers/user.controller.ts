import type { Request, Response, NextFunction } from 'express'
import * as userService from '../services/user.service.js'
import { success } from '../utils/response.js'

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.getProfile(req.user!._id)
    success(res, user)
  } catch (err) {
    next(err)
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await userService.updateProfile(req.user!._id, req.body as { name?: string })
    success(res, user, 'Profile updated')
  } catch (err) {
    next(err)
  }
}
