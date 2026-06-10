import { Router } from 'express'
import { ROLES } from '../../constants/roles.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  assignMentorSkill,
  createSkill,
  deleteSkill,
  getMentorSkills,
  getSkillById,
  getSkills,
  removeMentorSkill,
  updateSkill,
} from './skills.controller.js'
import {
  assignSkillSchema,
  createSkillSchema,
  mentorSkillIdParamSchema,
  skillIdParamSchema,
  updateSkillSchema,
} from './skills.validation.js'

const router = Router()

router.get(
  '/mentor',
  authenticate,
  authorize(ROLES.PEER_MENTOR),
  getMentorSkills,
)

router.post(
  '/mentor',
  authenticate,
  authorize(ROLES.PEER_MENTOR),
  validate(assignSkillSchema),
  assignMentorSkill,
)

router.delete(
  '/mentor/:id',
  authenticate,
  authorize(ROLES.PEER_MENTOR),
  validate(mentorSkillIdParamSchema, 'params'),
  removeMentorSkill,
)

router.post(
  '/',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(createSkillSchema),
  createSkill,
)

router.get('/', authenticate, getSkills)

router.get(
  '/:id',
  authenticate,
  validate(skillIdParamSchema, 'params'),
  getSkillById,
)

router.patch(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(skillIdParamSchema, 'params'),
  validate(updateSkillSchema),
  updateSkill,
)

router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(skillIdParamSchema, 'params'),
  deleteSkill,
)

export default router
