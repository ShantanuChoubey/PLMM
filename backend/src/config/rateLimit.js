import rateLimit from 'express-rate-limit'
import { MESSAGES } from '../constants/messages.js'

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: MESSAGES.TOO_MANY_REQUESTS,
  },
})
