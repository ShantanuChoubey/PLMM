import { StatusCodes } from 'http-status-codes'

export function sendSuccess(res, { message, data, statusCode = StatusCodes.OK } = {}) {
  const payload = { success: true }

  if (message) payload.message = message
  if (data !== undefined) payload.data = data

  return res.status(statusCode).json(payload)
}

export function sendError(res, { message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, errors } = {}) {
  const payload = {
    success: false,
    message: message || 'Something went wrong',
  }

  if (errors) payload.errors = errors

  return res.status(statusCode).json(payload)
}
