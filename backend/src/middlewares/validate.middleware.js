import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'
import { MESSAGES } from '../constants/messages.js'
import { AppError } from '../utils/AppError.js'

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source])

      if (source === 'body') {
        req.body = parsed
      } else {
        req.validated ??= {}
        req.validated[source] = parsed
      }

      return next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }))
        return next(new AppError(MESSAGES.VALIDATION_FAILED, StatusCodes.BAD_REQUEST, true, errors))
      }
      return next(error)
    }
  }
}
