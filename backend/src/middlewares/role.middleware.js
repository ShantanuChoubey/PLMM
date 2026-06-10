import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../constants/messages.js'
import { AppError } from '../utils/AppError.js'

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(MESSAGES.UNAUTHORIZED, StatusCodes.UNAUTHORIZED))
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN))
    }

    return next()
  }
}
