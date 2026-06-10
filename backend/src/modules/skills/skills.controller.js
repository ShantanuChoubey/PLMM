import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { skillsService } from './skills.service.js'

export const createSkill = asyncHandler(async (req, res) => {
  const skill = await skillsService.createSkill(req.body)

  return sendSuccess(res, {
    message: MESSAGES.SKILL_CREATED,
    statusCode: StatusCodes.CREATED,
    data: { skill },
  })
})

export const getSkills = asyncHandler(async (req, res) => {
  const { search, skip, take } = req.query
  const result = await skillsService.getSkills({
    filters: { search },
    pagination: {
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    },
  })

  return sendSuccess(res, {
    data: result,
  })
})

export const getSkillById = asyncHandler(async (req, res) => {
  const skill = await skillsService.getSkillById(req.params.id)

  return sendSuccess(res, {
    data: { skill },
  })
})

export const updateSkill = asyncHandler(async (req, res) => {
  const skill = await skillsService.updateSkill(req.params.id, req.body)

  return sendSuccess(res, {
    message: MESSAGES.SKILL_UPDATED,
    data: { skill },
  })
})

export const deleteSkill = asyncHandler(async (req, res) => {
  await skillsService.deleteSkill(req.params.id)

  return sendSuccess(res, {
    message: MESSAGES.SKILL_DELETED,
  })
})

export const assignMentorSkill = asyncHandler(async (req, res) => {
  const result = await skillsService.assignSkillToMentor(req.user.id, req.body.skillId)

  return sendSuccess(res, {
    message: MESSAGES.SKILL_ASSIGNED,
    statusCode: StatusCodes.CREATED,
    data: result,
  })
})

export const getMentorSkills = asyncHandler(async (req, res) => {
  const result = await skillsService.getMentorSkills(req.user.id)

  return sendSuccess(res, {
    data: result,
  })
})

export const removeMentorSkill = asyncHandler(async (req, res) => {
  await skillsService.removeMentorSkill(req.user.id, req.params.id)

  return sendSuccess(res, {
    message: MESSAGES.SKILL_REMOVED,
  })
})
