import { Router } from 'express'
import { ROLES } from '../../constants/roles.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { goalAnalysisRateLimiter } from '../../middlewares/aiRateLimit.middleware.js'
import {
  analyzeGoal,
  deleteAnalysis,
  getAnalyses,
  getAnalysisById,
} from './goalAnalysis.controller.js'
import {
  analyzeGoalSchema,
  goalAnalysisIdParamSchema,
  goalAnalysisQuerySchema,
} from './goalAnalysis.validation.js'

const router = Router()

router.use(authenticate, authorize(ROLES.LEARNER))

// POST /ai/analyze-goal — dedicated rate limiter
router.post('/analyze-goal', goalAnalysisRateLimiter, validate(analyzeGoalSchema), analyzeGoal)

// GET /ai/goal-analyses
router.get('/goal-analyses', validate(goalAnalysisQuerySchema, 'query'), getAnalyses)

// GET /ai/goal-analyses/:id
router.get('/goal-analyses/:id', validate(goalAnalysisIdParamSchema, 'params'), getAnalysisById)

// DELETE /ai/goal-analyses/:id
router.delete('/goal-analyses/:id', validate(goalAnalysisIdParamSchema, 'params'), deleteAnalysis)

export default router
