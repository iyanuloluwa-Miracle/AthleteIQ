import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import * as authService from '../services/auth.service.js'
import { success, created } from '../utils/response.js'
import { env } from '../config/env.js'
import type { IUser } from '../models/User.model.js'

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

export function googleCallback(req: Request, res: Response): void {
  const user = req.user as IUser
  const token = jwt.sign({ sub: user._id.toString() }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn']
  })
  res.redirect(`${env.clientUrl}/auth/callback?token=${token}`)
}
