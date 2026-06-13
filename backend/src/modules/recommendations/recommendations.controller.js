import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { recommendationsService } from './recommendations.service.js'

// POST /api/v1/ai/recommend-mentors
export const generateRecommendations = asyncHandler(async (req, res) => {
  const { learnerId } = req.body
  const recommendations = await recommendationsService.generateRecommendations(learnerId)
  return sendSuccess(res, {
    message: MESSAGES.RECOMMENDATIONS_GENERATED,
    statusCode: StatusCodes.CREATED,
    data: { recommendations },
  })
})

// GET /api/v1/ai/recommendations
export const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await recommendationsService.getRecommendations(req.user.id)
  return sendSuccess(res, { data: { recommendations } })
})

// GET /api/v1/ai/recommendations/:id
export const getRecommendationById = asyncHandler(async (req, res) => {
  const recommendation = await recommendationsService.getRecommendationById(req.params.id)
  return sendSuccess(res, { data: { recommendation } })
})

// DELETE /api/v1/ai/recommendations
export const deleteRecommendations = asyncHandler(async (req, res) => {
  await recommendationsService.deleteRecommendations(req.user.id)
  return sendSuccess(res, { message: MESSAGES.RECOMMENDATIONS_DELETED })
})
