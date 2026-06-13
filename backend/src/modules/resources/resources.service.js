import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { ROLES } from '../../constants/roles.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js'
import { env } from '../../config/env.js'
import { AppError } from '../../utils/AppError.js'
import { groupsRepository } from '../groups/groups.repository.js'
import { resourcesRepository } from './resources.repository.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getResourceOrFail(id) {
  const resource = await resourcesRepository.findById(id)
  if (!resource) throw new AppError(MESSAGES.RESOURCE_NOT_FOUND, StatusCodes.NOT_FOUND)
  return resource
}

function buildWhereClause({ search, category, type, uploadedBy, groupId }) {
  const where = {}

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (category) where.category = { contains: category, mode: 'insensitive' }
  if (type)       where.type = type
  if (uploadedBy) where.uploadedBy = uploadedBy
  if (groupId)    where.groupId = groupId

  return where
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const resourcesService = {
  // POST /resources — supports file upload or external URL
  async createResource(userId, data, file) {
    const { title, description, type, category, externalUrl, groupId } = data

    // Validate group membership if resource is tied to a group
    if (groupId) {
      const group = await groupsRepository.findById(groupId)
      if (!group) throw new AppError(MESSAGES.GROUP_NOT_FOUND, StatusCodes.NOT_FOUND)

      const member = await groupsRepository.findMember(groupId, userId)
      if (!member) throw new AppError(MESSAGES.NOT_GROUP_MEMBER, StatusCodes.FORBIDDEN)
    }

    let fileUrl = externalUrl ?? null
    let publicId = null

    // Upload file to Cloudinary if provided
    if (file) {
      if (!env.cloudinary.configured) {
        throw new AppError(MESSAGES.CLOUDINARY_NOT_CONFIGURED, StatusCodes.SERVICE_UNAVAILABLE)
      }

      const folder = groupId ? `plmm/groups/${groupId}` : `plmm/users/${userId}`
      const result = await uploadToCloudinary(file.buffer, {
        folder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
      }).catch((err) => {
        throw new AppError(`${MESSAGES.UPLOAD_FAILED}: ${err.message}`, StatusCodes.BAD_GATEWAY)
      })

      fileUrl = result.secure_url
      publicId = result.public_id
    }

    if (!fileUrl) {
      throw new AppError(
        'Either a file or an external URL is required',
        StatusCodes.UNPROCESSABLE_ENTITY,
      )
    }

    return resourcesRepository.create({
      title,
      description,
      type,
      category,
      fileUrl,
      publicId,
      externalUrl: externalUrl ?? null,
      uploadedBy: userId,
      groupId: groupId ?? null,
    })
  },

  // GET /resources
  async getResources(filters, pagination) {
    const where = buildWhereClause(filters)
    const { page, limit, sortBy, sortOrder } = pagination
    const skip = (page - 1) * limit
    const orderBy = { [sortBy]: sortOrder }

    const [resources, total] = await Promise.all([
      resourcesRepository.findMany({ where, skip, take: limit, orderBy }),
      resourcesRepository.count(where),
    ])

    return {
      resources,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  },

  // GET /resources/:id
  async getResourceById(id) {
    return getResourceOrFail(id)
  },

  // PATCH /resources/:id
  async updateResource(userId, resourceId, data, userRole) {
    const resource = await resourcesRepository.findRawById(resourceId)
    if (!resource) throw new AppError(MESSAGES.RESOURCE_NOT_FOUND, StatusCodes.NOT_FOUND)

    const isOwner = resource.uploadedBy === userId
    const isAdmin = userRole === ROLES.ADMIN
    if (!isOwner && !isAdmin) throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)

    return resourcesRepository.update(resourceId, data)
  },

  // DELETE /resources/:id
  async deleteResource(userId, resourceId, userRole) {
    const resource = await resourcesRepository.findRawById(resourceId)
    if (!resource) throw new AppError(MESSAGES.RESOURCE_NOT_FOUND, StatusCodes.NOT_FOUND)

    const isOwner = resource.uploadedBy === userId
    const isAdmin = userRole === ROLES.ADMIN
    if (!isOwner && !isAdmin) throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)

    // Delete from Cloudinary if it was uploaded (not an external link)
    if (resource.publicId && env.cloudinary.configured) {
      await deleteFromCloudinary(resource.publicId).catch(() => {
        // Non-fatal — log and continue
      })
    }

    await resourcesRepository.delete(resourceId)
  },

  // PATCH /resources/:id/view
  async trackView(id) {
    const resource = await resourcesRepository.findRawById(id)
    if (!resource) throw new AppError(MESSAGES.RESOURCE_NOT_FOUND, StatusCodes.NOT_FOUND)
    return resourcesRepository.incrementViews(id)
  },

  // PATCH /resources/:id/download
  async trackDownload(id) {
    const resource = await resourcesRepository.findRawById(id)
    if (!resource) throw new AppError(MESSAGES.RESOURCE_NOT_FOUND, StatusCodes.NOT_FOUND)
    return resourcesRepository.incrementDownloads(id)
  },
}
