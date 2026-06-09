import { AUTH_ERROR_CODES, AuthError } from '@/constants/authErrors'

export const API_ERROR_CODES = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN',
}

export const API_ERROR_MESSAGES = {
  [API_ERROR_CODES.NETWORK]: 'Unable to reach the server. Check your connection and try again.',
  [API_ERROR_CODES.TIMEOUT]: 'The request timed out. Please try again.',
  [API_ERROR_CODES.UNAUTHORIZED]: 'Your session has expired. Please sign in again.',
  [API_ERROR_CODES.FORBIDDEN]: 'You do not have permission to perform this action.',
  [API_ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',
  [API_ERROR_CODES.RATE_LIMITED]: 'Too many requests. Please wait a moment and try again.',
  [API_ERROR_CODES.SERVER]: 'Something went wrong on our end. Please try again later.',
  [API_ERROR_CODES.UNKNOWN]: 'An unexpected error occurred. Please try again.',
}

export class ApiError extends Error {
  constructor(code, message, status, details) {
    super(message || API_ERROR_MESSAGES[code] || API_ERROR_MESSAGES[API_ERROR_CODES.UNKNOWN])
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}

export function normalizeApiError(error) {
  if (error instanceof ApiError || error instanceof AuthError) {
    return error
  }

  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return new ApiError(API_ERROR_CODES.TIMEOUT, API_ERROR_MESSAGES[API_ERROR_CODES.TIMEOUT])
    }
    return new ApiError(API_ERROR_CODES.NETWORK, API_ERROR_MESSAGES[API_ERROR_CODES.NETWORK])
  }

  const { status, data } = error.response
  const message = data?.message || data?.error

  switch (status) {
    case 401:
      return new AuthError(AUTH_ERROR_CODES.SESSION_EXPIRED, message)
    case 403:
      return new ApiError(API_ERROR_CODES.FORBIDDEN, message, status, data)
    case 404:
      return new ApiError(API_ERROR_CODES.NOT_FOUND, message, status, data)
    case 429:
      return new ApiError(API_ERROR_CODES.RATE_LIMITED, message, status, data)
    default:
      if (status >= 500) {
        return new ApiError(API_ERROR_CODES.SERVER, message, status, data)
      }
      return new ApiError(API_ERROR_CODES.UNKNOWN, message, status, data)
  }
}

export function getErrorMessage(error) {
  if (error instanceof ApiError || error instanceof AuthError) {
    return error.message
  }
  return API_ERROR_MESSAGES[API_ERROR_CODES.UNKNOWN]
}
