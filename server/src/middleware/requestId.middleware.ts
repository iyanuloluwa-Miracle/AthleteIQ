import { randomUUID } from 'crypto'
import type { Request, Response, NextFunction } from 'express'

// Extend Express's Request type globally so req.id is available everywhere
declare global {
  namespace Express {
    interface Request {
      id: string
    }
  }
}

/**
 * Attaches a unique request ID to every incoming request.
 *
 * - Honours X-Request-Id if provided by a load balancer / API gateway
 *   so the same ID propagates across distributed services.
 * - Falls back to a crypto.randomUUID() for requests without one.
 * - Echoes the ID back in the X-Request-Id response header so clients
 *   can include it in bug reports and support tickets.
 */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.headers['x-request-id']
  req.id = (Array.isArray(incoming) ? incoming[0] : incoming) ?? randomUUID()
  res.setHeader('X-Request-Id', req.id)
  next()
}
