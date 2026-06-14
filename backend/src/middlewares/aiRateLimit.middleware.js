import rateLimit, { ipKeyGenerator } from 'express-rate-limit'
import { StatusCodes } from 'http-status-codes'

function makeKey(prefix, req, res) {
  return `${prefix}:${req.user?.id ?? ipKeyGenerator(req, res)}`
}

function makeLimiter(prefix, max, label) {
  return rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req, res) => makeKey(prefix, req, res),
    message: {
      success: false,
      message: `Too many ${label} requests. Maximum ${max} per hour. Please try again later.`,
    },
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
  })
}

// /ai/test endpoint — 20/hr
export const aiRateLimiter = makeLimiter('ai', 20, 'AI')

// /ai/recommend-mentors — 10/hr
export const recommendationRateLimiter = makeLimiter('rec', 10, 'recommendation')

// /ai/study-plan — 10/hr
export const studyPlanRateLimiter = makeLimiter('sp', 10, 'study plan')

// /ai/analyze-goal — 20/hr
export const goalAnalysisRateLimiter = makeLimiter('ga', 20, 'goal analysis')
