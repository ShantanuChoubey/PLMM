import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { progressService } from './progress.service.js'

// POST /api/v1/progress
export const createRecord = asyncHandler(async (req, res) => {
  const record = await progressService.createRecord(req.user.id, req.body)
  return sendSuccess(res, {
    message: MESSAGES.PROGRESS_CREATED,
    statusCode: StatusCodes.CREATED,
    data: { record },
  })
})

// GET /api/v1/progress
export const getRecords = asyncHandler(async (req, res) => {
  const { status, skill, sortBy, sortOrder, page, limit } =
    req.validated?.query ?? req.query

  const result = await progressService.getRecords(
    req.user.id,
    { status, skill },
    { page: page ?? 1, limit: limit ?? 20, sortBy: sortBy ?? 'createdAt', sortOrder: sortOrder ?? 'desc' },
  )
  return sendSuccess(res, { data: result })
})

// GET /api/v1/progress/summary  — must be defined before /:id in routes
export const getProgressSummary = asyncHandler(async (req, res) => {
  const summary = await progressService.getProgressSummary(req.user.id)
  return sendSuccess(res, { data: { summary } })
})

// GET /api/v1/progress/:id
export const getRecordById = asyncHandler(async (req, res) => {
  const record = await progressService.getRecordById(req.user.id, req.params.id, req.user.role)
  return sendSuccess(res, { data: { record } })
})

// PATCH /api/v1/progress/:id
export const updateRecord = asyncHandler(async (req, res) => {
  const record = await progressService.updateRecord(req.user.id, req.params.id, req.body)
  return sendSuccess(res, {
    message: MESSAGES.PROGRESS_UPDATED,
    data: { record },
  })
})

// DELETE /api/v1/progress/:id
export const deleteRecord = asyncHandler(async (req, res) => {
  await progressService.deleteRecord(req.user.id, req.params.id, req.user.role)
  return sendSuccess(res, { message: MESSAGES.PROGRESS_DELETED })
})
