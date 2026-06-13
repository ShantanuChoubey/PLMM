import { Router } from 'express'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  createGroup,
  deleteGroup,
  getGroupById,
  getGroupMembers,
  getGroups,
  joinGroup,
  leaveGroup,
  updateGroup,
} from './groups.controller.js'
import {
  createGroupSchema,
  groupIdParamSchema,
  groupQuerySchema,
  updateGroupSchema,
} from './groups.validation.js'

const router = Router()

router.use(authenticate)

router.post('/', validate(createGroupSchema), createGroup)

router.get('/', validate(groupQuerySchema, 'query'), getGroups)

router.get('/:id', validate(groupIdParamSchema, 'params'), getGroupById)

router.patch(
  '/:id',
  validate(groupIdParamSchema, 'params'),
  validate(updateGroupSchema),
  updateGroup,
)

router.delete('/:id', validate(groupIdParamSchema, 'params'), deleteGroup)

router.post('/:id/join', validate(groupIdParamSchema, 'params'), joinGroup)

router.post('/:id/leave', validate(groupIdParamSchema, 'params'), leaveGroup)

router.get('/:id/members', validate(groupIdParamSchema, 'params'), getGroupMembers)

export default router
