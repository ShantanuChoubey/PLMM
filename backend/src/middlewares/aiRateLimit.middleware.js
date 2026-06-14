import rateLimit, { ipKeyGenerator } from 'express-rate-limit'
import { StatusCodes } from 'http-status-codes'

/**
 * Shared AI rate limiter: 20 requests per hour.
 * Applied to the /ai/test endpoint.
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) =>
    req.user?.id ?? ipKeyGenerator(req, res),
  message: {
    success: false,
    message: 'Too many AI requests. Maximum 20 requests per hour. Please try again later.',
  },
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
})

/**
 * Study plan rate limiter: 10 generations per hour (separate bucket).
 */
export const studyPlanRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) =>
    `sp:${req.user?.id ?? ipKeyGenerator(req, res)}`,
  message: {
    success: false,
    message: 'Too many study plan requests. Maximum 10 per hour. Please try again later.',
  },
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
})

/**
 * Recommendation rate limiter: 10 generations per hour (separate bucket).
 */
export const recommendationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) =>
    `rec:${req.user?.id ?? ipKeyGenerator(req, res)}`,
  message: {
    success: false,
    message: 'Too many recommendation requests. Maximum 10 per hour. Please try again later.',
  },
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
})
