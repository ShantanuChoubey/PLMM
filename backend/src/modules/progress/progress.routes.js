import { Router } from 'express'
import { ROLES } from '../../constants/roles.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  createRecord,
  deleteRecord,
  getProgressSummary,
  getRecordById,
  getRecords,
  updateRecord,
} from './progress.controller.js'
import {
  createProgressSchema,
  progressIdParamSchema,
  progressQuerySchema,
  updateProgressSchema,
} from './progress.validation.js'

const router = Router()

router.use(authenticate)

// All progress routes are LEARNER only (admin can view via service layer)
const learnerOnly = authorize(ROLES.LEARNER)

// POST /progress
router.post('/', learnerOnly, validate(createProgressSchema), createRecord)

// GET /progress
router.get('/', learnerOnly, validate(progressQuerySchema, 'query'), getRecords)

// GET /progress/summary — must be BEFORE /:id to avoid "summary" being treated as an id
router.get('/summary', learnerOnly, getProgressSummary)

// GET /progress/:id
router.get('/:id', validate(progressIdParamSchema, 'params'), getRecordById)

// PATCH /progress/:id
router.patch(
  '/:id',
  learnerOnly,
  validate(progressIdParamSchema, 'params'),
  validate(updateProgressSchema),
  updateRecord,
)

// DELETE /progress/:id
router.delete('/:id', validate(progressIdParamSchema, 'params'), deleteRecord)

export default router
