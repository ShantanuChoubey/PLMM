import { Router } from 'express'
import { ROLES } from '../../constants/roles.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  createSlot,
  deleteSlot,
  getMentorSlots,
  getMySlots,
  updateSlot,
} from './availability.controller.js'
import {
  createSlotSchema,
  mentorIdParamSchema,
  slotIdParamSchema,
  updateSlotSchema,
} from './availability.validation.js'

const router = Router()

router.post(
  '/',
  authenticate,
  authorize(ROLES.PEER_MENTOR),
  validate(createSlotSchema),
  createSlot,
)

router.get(
  '/me',
  authenticate,
  authorize(ROLES.PEER_MENTOR),
  getMySlots,
)

router.patch(
  '/:slotId',
  authenticate,
  authorize(ROLES.PEER_MENTOR),
  validate(slotIdParamSchema, 'params'),
  validate(updateSlotSchema),
  updateSlot,
)

router.delete(
  '/:slotId',
  authenticate,
  authorize(ROLES.PEER_MENTOR),
  validate(slotIdParamSchema, 'params'),
  deleteSlot,
)

router.get(
  '/:mentorId',
  validate(mentorIdParamSchema, 'params'),
  getMentorSlots,
)

export default router
