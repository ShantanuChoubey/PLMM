import { Router } from 'express'
import { ROLES } from '../../constants/roles.js'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { authorize } from '../../middlewares/role.middleware.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'

const router = Router()

router.get(
  '/learner',
  authenticate,
  authorize(ROLES.LEARNER),
  asyncHandler(async (req, res) => {
    return sendSuccess(res, {
      message: 'Learner route accessible',
      data: { role: req.user.role },
    })
  }),
)

router.get(
  '/mentor',
  authenticate,
  authorize(ROLES.PEER_MENTOR),
  asyncHandler(async (req, res) => {
    return sendSuccess(res, {
      message: 'Mentor route accessible',
      data: { role: req.user.role },
    })
  }),
)

router.get(
  '/admin',
  authenticate,
  authorize(ROLES.ADMIN),
  asyncHandler(async (req, res) => {
    return sendSuccess(res, {
      message: 'Admin route accessible',
      data: { role: req.user.role },
    })
  }),
)

export default router
