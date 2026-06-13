import { Router } from 'express'
import { ROLES } from '../../constants/roles.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { getLogs, getLogById } from './audit.controller.js'
import { auditIdParamSchema, auditQuerySchema } from './audit.validation.js'

const router = Router()

// All audit routes — ADMIN only
router.use(authenticate, authorize(ROLES.ADMIN))

router.get('/', validate(auditQuerySchema, 'query'), getLogs)

router.get('/:id', validate(auditIdParamSchema, 'params'), getLogById)

export default router
