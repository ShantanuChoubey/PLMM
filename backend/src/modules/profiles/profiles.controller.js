import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { profilesService } from './profiles.service.js'

export const createLearnerProfile = asyncHandler(async (req, res) => {
  const profile = await profilesService.createLearnerProfile(req.user.id, req.body)

  return sendSuccess(res, {
    message: MESSAGES.PROFILE_CREATED,
    statusCode: StatusCodes.CREATED,
    data: { profile },
  })
})

export const getLearnerProfile = asyncHandler(async (req, res) => {
  const profile = await profilesService.getLearnerProfile(req.user.id)

  return sendSuccess(res, {
    data: { profile },
  })
})

export const updateLearnerProfile = asyncHandler(async (req, res) => {
  const profile = await profilesService.updateLearnerProfile(req.user.id, req.body)

  return sendSuccess(res, {
    message: MESSAGES.PROFILE_UPDATED,
    data: { profile },
  })
})

export const createMentorProfile = asyncHandler(async (req, res) => {
  const profile = await profilesService.createMentorProfile(req.user.id, req.body)

  return sendSuccess(res, {
    message: MESSAGES.PROFILE_CREATED,
    statusCode: StatusCodes.CREATED,
    data: { profile },
  })
})

export const getMentorProfile = asyncHandler(async (req, res) => {
  const profile = await profilesService.getMentorProfile(req.user.id)

  return sendSuccess(res, {
    data: { profile },
  })
})

export const updateMentorProfile = asyncHandler(async (req, res) => {
  const profile = await profilesService.updateMentorProfile(req.user.id, req.body)

  return sendSuccess(res, {
    message: MESSAGES.PROFILE_UPDATED,
    data: { profile },
  })
})

export const createFacultyProfile = asyncHandler(async (req, res) => {
  const profile = await profilesService.createFacultyProfile(req.user.id, req.body)

  return sendSuccess(res, {
    message: MESSAGES.PROFILE_CREATED,
    statusCode: StatusCodes.CREATED,
    data: { profile },
  })
})

export const getFacultyProfile = asyncHandler(async (req, res) => {
  const profile = await profilesService.getFacultyProfile(req.user.id)

  return sendSuccess(res, {
    data: { profile },
  })
})

export const updateFacultyProfile = asyncHandler(async (req, res) => {
  const profile = await profilesService.updateFacultyProfile(req.user.id, req.body)

  return sendSuccess(res, {
    message: MESSAGES.PROFILE_UPDATED,
    data: { profile },
  })
})
