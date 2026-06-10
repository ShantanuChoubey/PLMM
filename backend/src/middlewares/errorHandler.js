import { StatusCodes } from 'http-status-codes'
import { env } from '../config/env.js'
import { MESSAGES } from '../constants/messages.js'
import { AppError } from '../utils/AppError.js'
import { logger } from '../utils/logger.js'
import { sendError } from '../utils/response.js'

export function notFoundHandler(req, res, next) {
  next(new AppError(`${MESSAGES.NOT_FOUND}: ${req.originalUrl}`, StatusCodes.NOT_FOUND))
}

export function globalErrorHandler(err, req, res, next) {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  let message = err.message || MESSAGES.INTERNAL_ERROR

  if (err.code === 'P1001' || err.code === 'P1017') {
    statusCode = StatusCodes.SERVICE_UNAVAILABLE
    message = 'Database connection failed'
  }

  if (err.code === 'P2002') {
    statusCode = StatusCodes.CONFLICT
    const target = err.meta?.target

    if (Array.isArray(target) && target.includes('email')) {
      message = MESSAGES.EMAIL_EXISTS
    } else if (Array.isArray(target) && target.includes('name')) {
      message = MESSAGES.SKILL_ALREADY_EXISTS
    } else if (Array.isArray(target) && target.includes('userId')) {
      message = MESSAGES.PROFILE_ALREADY_EXISTS
    } else if (Array.isArray(target) && target.includes('mentorId') && target.includes('skillId')) {
      message = MESSAGES.SKILL_ALREADY_ASSIGNED
    } else {
      message = MESSAGES.PROFILE_ALREADY_EXISTS
    }
  }

  if (env.isDevelopment) {
    logger.error(message, { stack: err.stack, path: req.originalUrl })
  } else if (!err.isOperational) {
    logger.error(MESSAGES.INTERNAL_ERROR, { path: req.originalUrl })
    message = MESSAGES.INTERNAL_ERROR
  } else {
    logger.error(message, { path: req.originalUrl })
  }

  return sendError(res, { message, statusCode, errors: err.errors })
}
