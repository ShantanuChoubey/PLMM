import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { auditService } from './audit.service.js'

// GET /api/v1/admin/audit-logs
export const getLogs = asyncHandler(async (req, res) => {
  const { action, entityType, userId, dateFrom, dateTo, sortOrder, page, limit } =
    req.validated?.query ?? req.query

  const result = await auditService.getLogs(
    { action, entityType, userId, dateFrom, dateTo },
    { page: page ?? 1, limit: limit ?? 20, sortOrder: sortOrder ?? 'desc' },
  )

  return sendSuccess(res, {
    message: MESSAGES.AUDIT_LOGS_FETCHED,
    data: result,
  })
})

// GET /api/v1/admin/audit-logs/:id
export const getLogById = asyncHandler(async (req, res) => {
  const log = await auditService.getLogById(req.params.id)
  return sendSuccess(res, { data: { log } })
})
