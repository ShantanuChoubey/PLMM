export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  UNKNOWN: 'UNKNOWN',
}

export const AUTH_ERROR_MESSAGES = {
  [AUTH_ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid credentials. Please check your email and password.',
  [AUTH_ERROR_CODES.SESSION_EXPIRED]: 'Your session has expired. Please sign in again.',
  [AUTH_ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to access this resource.',
  [AUTH_ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection and try again.',
  [AUTH_ERROR_CODES.EMAIL_EXISTS]: 'An account with this email already exists.',
  [AUTH_ERROR_CODES.UNKNOWN]: 'Something went wrong. Please try again.',
}

export class AuthError extends Error {
  constructor(code, message) {
    super(message || AUTH_ERROR_MESSAGES[code] || AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.UNKNOWN])
    this.name = 'AuthError'
    this.code = code
  }
}
