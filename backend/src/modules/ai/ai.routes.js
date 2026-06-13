import { Router } from 'express'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { aiRateLimiter } from '../../middlewares/aiRateLimit.middleware.js'
import { testAI } from './ai.controller.js'
import { testPromptSchema } from './ai.validation.js'

const router = Router()

// All AI routes require authentication + AI rate limiter
router.use(authenticate, aiRateLimiter)

// POST /api/v1/ai/test
router.post('/test', validate(testPromptSchema), testAI)

export default router
