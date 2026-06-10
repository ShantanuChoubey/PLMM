import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { AppError } from '../../utils/AppError.js'
import { generateToken } from '../../utils/jwt.js'
import { comparePassword, hashPassword } from '../../utils/password.js'
import { sanitizeUser } from '../../utils/sanitizeUser.js'
import { authRepository } from './auth.repository.js'

// In-memory blacklist placeholder for future Redis-backed token revocation
const tokenBlacklist = new Set()

export const authService = {
  async register({ name, email, password, role }) {
    const normalizedEmail = email.toLowerCase()
    const existingUser = await authRepository.findByEmail(normalizedEmail)

    if (existingUser) {
      throw new AppError(MESSAGES.EMAIL_EXISTS, StatusCodes.CONFLICT)
    }

    const hashedPassword = await hashPassword(password)

    const user = await authRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    })

    const safeUser = sanitizeUser(user)
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return { user: safeUser, token }
  },

  async login({ email, password }) {
    const user = await authRepository.findByEmail(email.toLowerCase())

    if (!user) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED)
    }

    if (!user.isActive) {
      throw new AppError(MESSAGES.USER_DISABLED, StatusCodes.FORBIDDEN)
    }

    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED)
    }

    const safeUser = sanitizeUser(user)
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return { user: safeUser, token }
  },

  async getCurrentUser(userId) {
    const user = await authRepository.findById(userId)

    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    if (!user.isActive) {
      throw new AppError(MESSAGES.USER_DISABLED, StatusCodes.FORBIDDEN)
    }

    return sanitizeUser(user)
  },

  logout(token) {
    if (token) {
      tokenBlacklist.add(token)
    }

    return { message: MESSAGES.LOGOUT_SUCCESS }
  },

  isTokenBlacklisted(token) {
    return tokenBlacklist.has(token)
  },
}
