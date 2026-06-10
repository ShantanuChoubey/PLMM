import { Router } from 'express'
import { ROLES } from '../../constants/roles.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  createFacultyProfile,
  createLearnerProfile,
  createMentorProfile,
  getFacultyProfile,
  getLearnerProfile,
  getMentorProfile,
  updateFacultyProfile,
  updateLearnerProfile,
  updateMentorProfile,
} from './profiles.controller.js'
import {
  createFacultyProfileSchema,
  createLearnerProfileSchema,
  createMentorProfileSchema,
  updateFacultyProfileSchema,
  updateLearnerProfileSchema,
  updateMentorProfileSchema,
} from './profiles.validation.js'

const router = Router()

router.post(
  '/learner',
  authenticate,
  authorize(ROLES.LEARNER),
  validate(createLearnerProfileSchema),
  createLearnerProfile,
)

router.get('/learner', authenticate, authorize(ROLES.LEARNER), getLearnerProfile)

router.patch(
  '/learner',
  authenticate,
  authorize(ROLES.LEARNER),
  validate(updateLearnerProfileSchema),
  updateLearnerProfile,
)

router.post(
  '/mentor',
  authenticate,
  authorize(ROLES.PEER_MENTOR),
  validate(createMentorProfileSchema),
  createMentorProfile,
)

router.get('/mentor', authenticate, authorize(ROLES.PEER_MENTOR), getMentorProfile)

router.patch(
  '/mentor',
  authenticate,
  authorize(ROLES.PEER_MENTOR),
  validate(updateMentorProfileSchema),
  updateMentorProfile,
)

router.post(
  '/faculty',
  authenticate,
  authorize(ROLES.FACULTY_MENTOR),
  validate(createFacultyProfileSchema),
  createFacultyProfile,
)

router.get('/faculty', authenticate, authorize(ROLES.FACULTY_MENTOR), getFacultyProfile)

router.patch(
  '/faculty',
  authenticate,
  authorize(ROLES.FACULTY_MENTOR),
  validate(updateFacultyProfileSchema),
  updateFacultyProfile,
)

export default router
