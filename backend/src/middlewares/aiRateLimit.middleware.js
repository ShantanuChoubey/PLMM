import rateLimit, { ipKeyGenerator } from 'express-rate-limit'
import { StatusCodes } from 'http-status-codes'

/**
 * AI-specific rate limiter: 20 requests per hour.
 * When the user is authenticated, keyed by userId.
 * Otherwise, keyed by IP (using the library's IPv6-safe ipKeyGenerator).
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  // Use authenticated user ID when available, otherwise fall back to
  // the library's built-in IPv6-safe IP key generator.
  keyGenerator: (req, res) =>
    req.user?.id ?? ipKeyGenerator(req, res),
  message: {
    success: false,
    message: 'Too many AI requests. Maximum 20 requests per hour. Please try again later.',
  },
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
})
