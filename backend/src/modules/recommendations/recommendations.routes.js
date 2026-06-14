import { Router } from 'express'
import { ROLES } from '../../constants/roles.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { aiRateLimiter, recommendationRateLimiter } from '../../middlewares/aiRateLimit.middleware.js'
import {
  deleteRecommendations,
  generateRecommendations,
  getRecommendationById,
  getRecommendations,
} from './recommendations.controller.js'
import {
  generateRecommendationsSchema,
  recommendationIdParamSchema,
} from './recommendations.validation.js'

const router = Router()

router.use(authenticate)

// POST /ai/recommend-mentors — learner only, AI rate limited
router.post(
  '/recommend-mentors',
  authorize(ROLES.LEARNER),
  recommendationRateLimiter,
  validate(generateRecommendationsSchema),
  generateRecommendations,
)

// GET /ai/recommendations — learner gets their own
router.get('/recommendations', authorize(ROLES.LEARNER), getRecommendations)

// GET /ai/recommendations/:id — must be before /recommendations to avoid conflict
router.get(
  '/recommendations/:id',
  validate(recommendationIdParamSchema, 'params'),
  getRecommendationById,
)

// DELETE /ai/recommendations — clear to allow regeneration
router.delete('/recommendations', authorize(ROLES.LEARNER), deleteRecommendations)

export default router
