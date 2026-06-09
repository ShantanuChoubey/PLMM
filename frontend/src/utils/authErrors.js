import toast from 'react-hot-toast'
import { AUTH_ERROR_CODES, AUTH_ERROR_MESSAGES } from '@/constants/authErrors'

export function getAuthErrorMessage(error) {
  if (!error) {
    return AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.UNKNOWN]
  }

  if (error.code && AUTH_ERROR_MESSAGES[error.code]) {
    return error.message || AUTH_ERROR_MESSAGES[error.code]
  }

  if (error.message?.toLowerCase().includes('network')) {
    return AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.NETWORK_ERROR]
  }

  return error.message || AUTH_ERROR_MESSAGES[AUTH_ERROR_CODES.UNKNOWN]
}

export function showAuthError(error) {
  toast.error(getAuthErrorMessage(error))
}

export function showAuthSuccess(message) {
  toast.success(message)
}
