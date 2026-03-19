import type { Response } from 'express'

export function success<T>(res: Response, data: T | null = null, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data })
}

export function created<T>(res: Response, data: T | null = null, message = 'Created') {
  return success(res, data, message, 201)
}

export function paginated<T>(res: Response, data: T[], meta: Record<string, unknown>) {
  return res.status(200).json({ success: true, data, meta })
}
