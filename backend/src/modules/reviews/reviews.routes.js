import { Router } from 'express'
import { ROLES } from '../../constants/roles.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  createReview,
  deleteReview,
  getMentorReviews,
  getSessionReview,
  updateReview,
} from './reviews.controller.js'
import {
  createReviewSchema,
  mentorIdParamSchema,
  reviewIdParamSchema,
  sessionIdParamSchema,
  updateReviewSchema,
} from './reviews.validation.js'

const router = Router()

router.use(authenticate)

// Create review — learner only
router.post(
  '/',
  authorize(ROLES.LEARNER),
  validate(createReviewSchema),
  createReview,
)

// Get all reviews for a mentor (with stats + distribution)
router.get(
  '/mentor/:mentorId',
  validate(mentorIdParamSchema, 'params'),
  getMentorReviews,
)

// Get review for a specific session
router.get(
  '/session/:sessionId',
  validate(sessionIdParamSchema, 'params'),
  getSessionReview,
)

// Update review — owner or admin
router.patch(
  '/:id',
  validate(reviewIdParamSchema, 'params'),
  validate(updateReviewSchema),
  updateReview,
)

// Delete review — owner or admin
router.delete(
  '/:id',
  validate(reviewIdParamSchema, 'params'),
  deleteReview,
)

export default router
