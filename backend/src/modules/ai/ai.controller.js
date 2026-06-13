import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { aiService } from './ai.service.js'

// POST /api/v1/ai/test
export const testAI = asyncHandler(async (req, res) => {
  const { prompt } = req.body
  const response = await aiService.generateStructuredResponse(prompt)

  return sendSuccess(res, {
    message: MESSAGES.AI_RESPONSE_GENERATED,
    data: { response },
  })
})
