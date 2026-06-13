import { Router } from 'express'
import { ROLES } from '../../constants/roles.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  acceptSession,
  bookSession,
  cancelSession,
  completeSession,
  getSessionById,
  getSessions,
  rejectSession,
} from './sessions.controller.js'
import {
  bookSessionSchema,
  sessionIdParamSchema,
  sessionQuerySchema,
} from './sessions.validation.js'

const router = Router()

// All session routes require authentication
router.use(authenticate)

// ─── Book a session ──────────────────────────────────────────────────────────
router.post(
  '/',
  authorize(ROLES.LEARNER),
  validate(bookSessionSchema),
  bookSession,
)

// ─── Get sessions (role-aware) ───────────────────────────────────────────────
router.get(
  '/',
  validate(sessionQuerySchema, 'query'),
  getSessions,
)

// ─── Get session details ─────────────────────────────────────────────────────
router.get(
  '/:id',
  validate(sessionIdParamSchema, 'params'),
  getSessionById,
)

// ─── Accept session ───────────────────────────────────────────────────────────
router.patch(
  '/:id/accept',
  authorize(ROLES.PEER_MENTOR),
  validate(sessionIdParamSchema, 'params'),
  acceptSession,
)

// ─── Reject session ───────────────────────────────────────────────────────────
router.patch(
  '/:id/reject',
  authorize(ROLES.PEER_MENTOR),
  validate(sessionIdParamSchema, 'params'),
  rejectSession,
)

// ─── Cancel session ───────────────────────────────────────────────────────────
router.patch(
  '/:id/cancel',
  authorize(ROLES.LEARNER, ROLES.PEER_MENTOR, ROLES.ADMIN),
  validate(sessionIdParamSchema, 'params'),
  cancelSession,
)

// ─── Complete session ─────────────────────────────────────────────────────────
router.patch(
  '/:id/complete',
  authorize(ROLES.PEER_MENTOR),
  validate(sessionIdParamSchema, 'params'),
  completeSession,
)

export default router
