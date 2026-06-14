import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { goalAnalysisService } from './goalAnalysis.service.js'

// POST /api/v1/ai/analyze-goal
export const analyzeGoal = asyncHandler(async (req, res) => {
  const analysis = await goalAnalysisService.analyzeGoal(req.user.id, req.body)
  return sendSuccess(res, {
    message: MESSAGES.GOAL_ANALYSIS_GENERATED,
    statusCode: StatusCodes.CREATED,
    data: { analysis },
  })
})

// GET /api/v1/ai/goal-analyses
export const getAnalyses = asyncHandler(async (req, res) => {
  const { sortBy, sortOrder, page, limit } = req.validated?.query ?? req.query
  const result = await goalAnalysisService.getAnalyses(req.user.id, {
    page: page ?? 1,
    limit: limit ?? 10,
    sortBy: sortBy ?? 'createdAt',
    sortOrder: sortOrder ?? 'desc',
  })
  return sendSuccess(res, { data: result })
})

// GET /api/v1/ai/goal-analyses/:id
export const getAnalysisById = asyncHandler(async (req, res) => {
  const analysis = await goalAnalysisService.getAnalysisById(req.user.id, req.params.id)
  return sendSuccess(res, { data: { analysis } })
})

// DELETE /api/v1/ai/goal-analyses/:id
export const deleteAnalysis = asyncHandler(async (req, res) => {
  await goalAnalysisService.deleteAnalysis(req.user.id, req.params.id)
  return sendSuccess(res, { message: MESSAGES.GOAL_ANALYSIS_DELETED })
})
