import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { studyPlanService } from './studyPlan.service.js'

// POST /api/v1/ai/study-plan
export const generateStudyPlan = asyncHandler(async (req, res) => {
  const plan = await studyPlanService.generateStudyPlan(req.user.id, req.body)
  return sendSuccess(res, {
    message: MESSAGES.STUDY_PLAN_GENERATED,
    statusCode: StatusCodes.CREATED,
    data: { plan },
  })
})

// GET /api/v1/ai/study-plans
export const getStudyPlans = asyncHandler(async (req, res) => {
  const { sortBy, sortOrder, page, limit } = req.validated?.query ?? req.query
  const result = await studyPlanService.getStudyPlans(req.user.id, {
    page: page ?? 1,
    limit: limit ?? 10,
    sortBy: sortBy ?? 'createdAt',
    sortOrder: sortOrder ?? 'desc',
  })
  return sendSuccess(res, { data: result })
})

// GET /api/v1/ai/study-plans/:id
export const getStudyPlanById = asyncHandler(async (req, res) => {
  const plan = await studyPlanService.getStudyPlanById(req.user.id, req.params.id)
  return sendSuccess(res, { data: { plan } })
})

// DELETE /api/v1/ai/study-plans/:id
export const deleteStudyPlan = asyncHandler(async (req, res) => {
  await studyPlanService.deleteStudyPlan(req.user.id, req.params.id)
  return sendSuccess(res, { message: MESSAGES.STUDY_PLAN_DELETED })
})
