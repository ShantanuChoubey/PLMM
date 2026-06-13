import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { reviewsService } from './reviews.service.js'

// POST /api/v1/reviews
export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewsService.createReview(req.user.id, req.body)
  return sendSuccess(res, {
    message: MESSAGES.REVIEW_CREATED,
    statusCode: StatusCodes.CREATED,
    data: { review },
  })
})

// GET /api/v1/reviews/mentor/:mentorId
export const getMentorReviews = asyncHandler(async (req, res) => {
  const result = await reviewsService.getMentorReviews(req.params.mentorId)
  return sendSuccess(res, { data: result })
})

// GET /api/v1/reviews/session/:sessionId
export const getSessionReview = asyncHandler(async (req, res) => {
  const review = await reviewsService.getSessionReview(req.params.sessionId)
  return sendSuccess(res, { data: { review } })
})

// PATCH /api/v1/reviews/:id
export const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewsService.updateReview(
    req.user.id,
    req.params.id,
    req.body,
    req.user.role,
  )
  return sendSuccess(res, {
    message: MESSAGES.REVIEW_UPDATED,
    data: { review },
  })
})

// DELETE /api/v1/reviews/:id
export const deleteReview = asyncHandler(async (req, res) => {
  await reviewsService.deleteReview(req.user.id, req.params.id, req.user.role)
  return sendSuccess(res, { message: MESSAGES.REVIEW_DELETED })
})
