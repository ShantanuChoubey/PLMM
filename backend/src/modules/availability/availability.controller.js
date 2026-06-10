import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { availabilityService } from './availability.service.js'

export const createSlot = asyncHandler(async (req, res) => {
  const slot = await availabilityService.createSlot(req.user.id, req.body)

  return sendSuccess(res, {
    message: MESSAGES.SLOT_CREATED,
    statusCode: StatusCodes.CREATED,
    data: { slot },
  })
})

export const getMySlots = asyncHandler(async (req, res) => {
  const slots = await availabilityService.getMySlots(req.user.id)

  return sendSuccess(res, {
    data: { slots },
  })
})

export const updateSlot = asyncHandler(async (req, res) => {
  const slot = await availabilityService.updateSlot(req.user.id, req.params.slotId, req.body)

  return sendSuccess(res, {
    message: MESSAGES.SLOT_UPDATED,
    data: { slot },
  })
})

export const deleteSlot = asyncHandler(async (req, res) => {
  await availabilityService.deleteSlot(req.user.id, req.params.slotId)

  return sendSuccess(res, {
    message: MESSAGES.SLOT_DELETED,
  })
})

export const getMentorSlots = asyncHandler(async (req, res) => {
  const slots = await availabilityService.getMentorPublicSlots(req.params.mentorId)

  return sendSuccess(res, {
    data: { slots },
  })
})
