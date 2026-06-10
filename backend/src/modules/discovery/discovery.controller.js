import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { discoveryService } from './discovery.service.js'

export const searchMentors = asyncHandler(async (req, res) => {
  const query = req.validated?.query ?? req.query
  const result = await discoveryService.searchMentors(query)

  return sendSuccess(res, {
    data: result,
  })
})

export const getMentorDetails = asyncHandler(async (req, res) => {
  const mentor = await discoveryService.getMentorDetails(req.params.mentorId)

  return sendSuccess(res, {
    data: { mentor },
  })
})
