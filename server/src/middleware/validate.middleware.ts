import type { Request, Response, NextFunction } from 'express'
import type { ObjectSchema } from 'joi'
import { ValidationError } from '../utils/errors.js'

export function validate(schema: ObjectSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      const message = error.details.map((d) => d.message).join(', ')
      return next(new ValidationError(message))
    }
    next()
  }
}
