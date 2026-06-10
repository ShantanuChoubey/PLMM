import { Router } from 'express'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { getMentorDetails, searchMentors } from './discovery.controller.js'
import { mentorIdParamSchema, searchMentorsQuerySchema } from './discovery.validation.js'

const router = Router()

router.get(
  '/',
  authenticate,
  validate(searchMentorsQuerySchema, 'query'),
  searchMentors,
)

router.get(
  '/:mentorId',
  authenticate,
  validate(mentorIdParamSchema, 'params'),
  getMentorDetails,
)

export default router
