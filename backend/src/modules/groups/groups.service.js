import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { ROLES } from '../../constants/roles.js'
import { AppError } from '../../utils/AppError.js'
import { groupsRepository } from './groups.repository.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getGroupOrFail(id) {
  const group = await groupsRepository.findById(id)
  if (!group) throw new AppError(MESSAGES.GROUP_NOT_FOUND, StatusCodes.NOT_FOUND)
  return group
}

// ─── Build search where clause ────────────────────────────────────────────────

function buildWhereClause({ search, category, visibility }) {
  const where = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (category) where.category = { contains: category, mode: 'insensitive' }
  if (visibility) where.visibility = visibility

  return where
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const groupsService = {
  // POST /groups
  async createGroup(userId, data) {
    const group = await groupsRepository.create({
      ...data,
      createdBy: userId,
    })

    // Add creator as OWNER member
    await groupsRepository.addMember(group.id, userId, 'OWNER')

    return group
  },

  // GET /groups
  async getGroups(filters, pagination) {
    const where = buildWhereClause(filters)
    const { page, limit, sortBy, sortOrder } = pagination
    const skip = (page - 1) * limit

    // Build orderBy — member count sorting requires raw query; use createdAt fallback
    const orderBy = sortBy === 'name'
      ? { name: sortOrder }
      : { createdAt: sortOrder }

    const [groups, total] = await Promise.all([
      groupsRepository.findMany({ where, skip, take: limit, orderBy }),
      groupsRepository.count(where),
    ])

    return {
      groups,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  },

  // GET /groups/:id
  async getGroupById(id) {
    const group = await groupsRepository.findByIdWithDetails(id)
    if (!group) throw new AppError(MESSAGES.GROUP_NOT_FOUND, StatusCodes.NOT_FOUND)
    return group
  },

  // PATCH /groups/:id
  async updateGroup(userId, groupId, data, userRole) {
    const group = await getGroupOrFail(groupId)

    const member = await groupsRepository.findMember(groupId, userId)
    const isOwner = member?.role === 'OWNER'
    const isAdmin = userRole === ROLES.ADMIN

    if (!isOwner && !isAdmin) {
      throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    }

    return groupsRepository.update(groupId, data)
  },

  // DELETE /groups/:id
  async deleteGroup(userId, groupId, userRole) {
    const group = await getGroupOrFail(groupId)

    const member = await groupsRepository.findMember(groupId, userId)
    const isOwner = member?.role === 'OWNER'
    const isAdmin = userRole === ROLES.ADMIN

    if (!isOwner && !isAdmin) {
      throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    }

    await groupsRepository.delete(groupId)
  },

  // POST /groups/:id/join
  async joinGroup(userId, groupId) {
    const group = await getGroupOrFail(groupId)

    // Already a member?
    const existing = await groupsRepository.findMember(groupId, userId)
    if (existing) throw new AppError(MESSAGES.ALREADY_GROUP_MEMBER, StatusCodes.CONFLICT)

    // Check capacity
    const memberCount = await groupsRepository.getMemberCount(groupId)
    if (memberCount >= group.maxMembers) {
      throw new AppError(MESSAGES.GROUP_FULL, StatusCodes.CONFLICT)
    }

    return groupsRepository.addMember(groupId, userId, 'MEMBER')
  },

  // POST /groups/:id/leave
  async leaveGroup(userId, groupId) {
    await getGroupOrFail(groupId)

    const member = await groupsRepository.findMember(groupId, userId)
    if (!member) throw new AppError(MESSAGES.NOT_GROUP_MEMBER, StatusCodes.BAD_REQUEST)

    // If leaving user is the owner, transfer ownership before leaving
    if (member.role === 'OWNER') {
      const next = await groupsRepository.findNextOwner(groupId, userId)
      if (next) {
        await groupsRepository.updateMemberRole(groupId, next.userId, 'OWNER')
      }
      // If no other members, the group is deleted when the last member leaves
    }

    await groupsRepository.removeMember(groupId, userId)
  },

  // GET /groups/:id/members
  async getGroupMembers(groupId) {
    await getGroupOrFail(groupId)
    return groupsRepository.getMembers(groupId)
  },
}
