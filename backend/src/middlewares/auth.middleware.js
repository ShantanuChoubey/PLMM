import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../constants/messages.js'
import { authRepository } from '../modules/auth/auth.repository.js'
import { AppError } from '../utils/AppError.js'
import { verifyToken } from '../utils/jwt.js'
import { sanitizeUser } from '../utils/sanitizeUser.js'

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(MESSAGES.TOKEN_MISSING, StatusCodes.UNAUTHORIZED)
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      throw new AppError(MESSAGES.TOKEN_MISSING, StatusCodes.UNAUTHORIZED)
    }

    const { authService } = await import('../modules/auth/auth.service.js')

    if (authService.isTokenBlacklisted(token)) {
      throw new AppError(MESSAGES.TOKEN_INVALID, StatusCodes.UNAUTHORIZED)
    }

    let decoded

    try {
      decoded = verifyToken(token)
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError(MESSAGES.TOKEN_EXPIRED, StatusCodes.UNAUTHORIZED)
      }
      throw new AppError(MESSAGES.TOKEN_INVALID, StatusCodes.UNAUTHORIZED)
    }

    const user = await authRepository.findById(decoded.userId)

    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, StatusCodes.UNAUTHORIZED)
    }

    if (!user.isActive) {
      throw new AppError(MESSAGES.USER_DISABLED, StatusCodes.FORBIDDEN)
    }

    req.user = sanitizeUser(user)
    req.token = token
    return next()
  } catch (error) {
    return next(error)
  }
}
