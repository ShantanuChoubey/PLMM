import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { sessionsService } from './sessions.service.js'

// POST /api/v1/sessions
export const bookSession = asyncHandler(async (req, res) => {
  const session = await sessionsService.bookSession(req.user.id, req.body)

  return sendSuccess(res, {
    message: MESSAGES.SESSION_BOOKED,
    statusCode: StatusCodes.CREATED,
    data: { session },
  })
})

// GET /api/v1/sessions
export const getSessions = asyncHandler(async (req, res) => {
  const { status, mentorId, learnerId, date, page, limit } = req.validated?.query ?? req.query

  const result = await sessionsService.getSessions(
    req.user,
    { status, mentorId, learnerId, date },
    { page: page ?? 1, limit: limit ?? 20 },
  )

  return sendSuccess(res, {
    data: result,
  })
})

// GET /api/v1/sessions/:id
export const getSessionById = asyncHandler(async (req, res) => {
  const session = await sessionsService.getSessionById(req.user, req.params.id)

  return sendSuccess(res, {
    data: { session },
  })
})

// PATCH /api/v1/sessions/:id/accept
export const acceptSession = asyncHandler(async (req, res) => {
  const session = await sessionsService.acceptSession(req.user.id, req.params.id)

  return sendSuccess(res, {
    message: MESSAGES.SESSION_ACCEPTED,
    data: { session },
  })
})

// PATCH /api/v1/sessions/:id/reject
export const rejectSession = asyncHandler(async (req, res) => {
  const session = await sessionsService.rejectSession(req.user.id, req.params.id)

  return sendSuccess(res, {
    message: MESSAGES.SESSION_REJECTED,
    data: { session },
  })
})

// PATCH /api/v1/sessions/:id/cancel
export const cancelSession = asyncHandler(async (req, res) => {
  const session = await sessionsService.cancelSession(req.user, req.params.id)

  return sendSuccess(res, {
    message: MESSAGES.SESSION_CANCELLED,
    data: { session },
  })
})

// PATCH /api/v1/sessions/:id/complete
export const completeSession = asyncHandler(async (req, res) => {
  const session = await sessionsService.completeSession(req.user.id, req.params.id)

  return sendSuccess(res, {
    message: MESSAGES.SESSION_COMPLETED,
    data: { session },
  })
})
