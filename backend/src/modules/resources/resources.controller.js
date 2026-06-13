import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { resourcesService } from './resources.service.js'

// POST /api/v1/resources
export const createResource = asyncHandler(async (req, res) => {
  const resource = await resourcesService.createResource(req.user.id, req.body, req.file ?? null)
  return sendSuccess(res, {
    message: MESSAGES.RESOURCE_CREATED,
    statusCode: StatusCodes.CREATED,
    data: { resource },
  })
})

// GET /api/v1/resources
export const getResources = asyncHandler(async (req, res) => {
  const { search, category, type, uploadedBy, groupId, sortBy, sortOrder, page, limit } =
    req.validated?.query ?? req.query

  const result = await resourcesService.getResources(
    { search, category, type, uploadedBy, groupId },
    { page: page ?? 1, limit: limit ?? 20, sortBy: sortBy ?? 'createdAt', sortOrder: sortOrder ?? 'desc' },
  )
  return sendSuccess(res, { data: result })
})

// GET /api/v1/resources/:id
export const getResourceById = asyncHandler(async (req, res) => {
  const resource = await resourcesService.getResourceById(req.params.id)
  return sendSuccess(res, { data: { resource } })
})

// PATCH /api/v1/resources/:id
export const updateResource = asyncHandler(async (req, res) => {
  const resource = await resourcesService.updateResource(
    req.user.id,
    req.params.id,
    req.body,
    req.user.role,
  )
  return sendSuccess(res, { message: MESSAGES.RESOURCE_UPDATED, data: { resource } })
})

// DELETE /api/v1/resources/:id
export const deleteResource = asyncHandler(async (req, res) => {
  await resourcesService.deleteResource(req.user.id, req.params.id, req.user.role)
  return sendSuccess(res, { message: MESSAGES.RESOURCE_DELETED })
})

// PATCH /api/v1/resources/:id/view
export const trackView = asyncHandler(async (req, res) => {
  const result = await resourcesService.trackView(req.params.id)
  return sendSuccess(res, { data: result })
})

// PATCH /api/v1/resources/:id/download
export const trackDownload = asyncHandler(async (req, res) => {
  const result = await resourcesService.trackDownload(req.params.id)
  return sendSuccess(res, { data: result })
})
