import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { groupsService } from './groups.service.js'

// POST /api/v1/groups
export const createGroup = asyncHandler(async (req, res) => {
  const group = await groupsService.createGroup(req.user.id, req.body)
  return sendSuccess(res, {
    message: MESSAGES.GROUP_CREATED,
    statusCode: StatusCodes.CREATED,
    data: { group },
  })
})

// GET /api/v1/groups
export const getGroups = asyncHandler(async (req, res) => {
  const { search, category, visibility, sortBy, sortOrder, page, limit } =
    req.validated?.query ?? req.query

  const result = await groupsService.getGroups(
    { search, category, visibility },
    { page: page ?? 1, limit: limit ?? 20, sortBy: sortBy ?? 'createdAt', sortOrder: sortOrder ?? 'desc' },
  )
  return sendSuccess(res, { data: result })
})

// GET /api/v1/groups/:id
export const getGroupById = asyncHandler(async (req, res) => {
  const group = await groupsService.getGroupById(req.params.id)
  return sendSuccess(res, { data: { group } })
})

// PATCH /api/v1/groups/:id
export const updateGroup = asyncHandler(async (req, res) => {
  const group = await groupsService.updateGroup(req.user.id, req.params.id, req.body, req.user.role)
  return sendSuccess(res, { message: MESSAGES.GROUP_UPDATED, data: { group } })
})

// DELETE /api/v1/groups/:id
export const deleteGroup = asyncHandler(async (req, res) => {
  await groupsService.deleteGroup(req.user.id, req.params.id, req.user.role)
  return sendSuccess(res, { message: MESSAGES.GROUP_DELETED })
})

// POST /api/v1/groups/:id/join
export const joinGroup = asyncHandler(async (req, res) => {
  const member = await groupsService.joinGroup(req.user.id, req.params.id)
  return sendSuccess(res, {
    message: MESSAGES.GROUP_JOINED,
    statusCode: StatusCodes.CREATED,
    data: { member },
  })
})

// POST /api/v1/groups/:id/leave
export const leaveGroup = asyncHandler(async (req, res) => {
  await groupsService.leaveGroup(req.user.id, req.params.id)
  return sendSuccess(res, { message: MESSAGES.GROUP_LEFT })
})

// GET /api/v1/groups/:id/members
export const getGroupMembers = asyncHandler(async (req, res) => {
  const members = await groupsService.getGroupMembers(req.params.id)
  return sendSuccess(res, { data: { members } })
})
