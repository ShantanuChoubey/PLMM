import { StatusCodes } from 'http-status-codes'

export class AppError extends Error {
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, isOperational = true, errors) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.errors = errors
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    Error.captureStackTrace(this, this.constructor)
  }
}
