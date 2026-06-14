import { Router } from 'express'
import { ROLES } from '../../constants/roles.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { aiRateLimiter, studyPlanRateLimiter } from '../../middlewares/aiRateLimit.middleware.js'
import {
  deleteStudyPlan,
  generateStudyPlan,
  getStudyPlanById,
  getStudyPlans,
} from './studyPlan.controller.js'
import {
  createStudyPlanSchema,
  studyPlanIdParamSchema,
  studyPlanQuerySchema,
} from './studyPlan.validation.js'

const router = Router()

router.use(authenticate, authorize(ROLES.LEARNER))

// POST /ai/study-plan — dedicated rate limiter (separate bucket from recommendations)
router.post('/study-plan', studyPlanRateLimiter, validate(createStudyPlanSchema), generateStudyPlan)

// GET /ai/study-plans — no rate limit needed for reads
router.get('/study-plans', validate(studyPlanQuerySchema, 'query'), getStudyPlans)

// GET /ai/study-plans/:id
router.get('/study-plans/:id', validate(studyPlanIdParamSchema, 'params'), getStudyPlanById)

// DELETE /ai/study-plans/:id
router.delete('/study-plans/:id', validate(studyPlanIdParamSchema, 'params'), deleteStudyPlan)

export default router
