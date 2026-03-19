import type { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service.js'
import { success, created } from '../utils/response.js'

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string }
    const data = await authService.register(name, email, password)
    created(res, data, 'Account created successfully')
  } catch (err) {
    next(err)
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string }
    const data = await authService.login(email, password)
    success(res, data, 'Logged in successfully')
  } catch (err) {
    next(err)
  }
}
