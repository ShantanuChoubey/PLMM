import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { AppError } from '../../utils/AppError.js'
import { auditRepository } from './audit.repository.js'

// ─── Core reusable helper ─────────────────────────────────────────────────────

/**
 * createAuditLog()
 * Call this from any service to record an auditable event.
 * Designed to be fire-and-forget — never throws.
 *
 * @param {object} params
 * @param {string|null} params.userId
 * @param {string} params.action        - AuditAction enum value
 * @param {string} params.entityType    - AuditEntityType enum value
 * @param {string|null} [params.entityId]
 * @param {string|null} [params.description]
 * @param {object|null} [params.metadata]
 */
export async function createAuditLog({
  userId = null,
  action,
  entityType,
  entityId = null,
  description = null,
  metadata = null,
}) {
  return auditRepository.create({
    userId,
    action,
    entityType,
    entityId,
    description,
    metadata,
  })
}

// ─── Convenience wrappers (ready for integration in other modules) ────────────

export const auditHelpers = {
  userRegistered: (userId) =>
    createAuditLog({ userId, action: 'REGISTER', entityType: 'USER', entityId: userId, description: 'User registered' }),

  userLoggedIn: (userId) =>
    createAuditLog({ userId, action: 'LOGIN', entityType: 'USER', entityId: userId, description: 'User logged in' }),

  userLoggedOut: (userId) =>
    createAuditLog({ userId, action: 'LOGOUT', entityType: 'USER', entityId: userId, description: 'User logged out' }),

  profileUpdated: (userId, profileId, profileType) =>
    createAuditLog({ userId, action: 'UPDATE', entityType: 'PROFILE', entityId: profileId, description: `${profileType} profile updated` }),

  skillCreated: (userId, skillId, skillName) =>
    createAuditLog({ userId, action: 'CREATE', entityType: 'SKILL', entityId: skillId, description: `Skill created: ${skillName}` }),

  sessionBooked: (userId, sessionId) =>
    createAuditLog({ userId, action: 'BOOK_SESSION', entityType: 'SESSION', entityId: sessionId, description: 'Session booked' }),

  sessionCompleted: (userId, sessionId) =>
    createAuditLog({ userId, action: 'COMPLETE_SESSION', entityType: 'SESSION', entityId: sessionId, description: 'Session completed' }),

  groupCreated: (userId, groupId, groupName) =>
    createAuditLog({ userId, action: 'CREATE', entityType: 'GROUP', entityId: groupId, description: `Group created: ${groupName}` }),

  groupJoined: (userId, groupId) =>
    createAuditLog({ userId, action: 'JOIN_GROUP', entityType: 'GROUP', entityId: groupId, description: 'User joined group' }),

  resourceUploaded: (userId, resourceId, title) =>
    createAuditLog({ userId, action: 'UPLOAD_RESOURCE', entityType: 'RESOURCE', entityId: resourceId, description: `Resource uploaded: ${title}` }),

  reviewSubmitted: (userId, reviewId) =>
    createAuditLog({ userId, action: 'SUBMIT_REVIEW', entityType: 'REVIEW', entityId: reviewId, description: 'Review submitted' }),
}

// ─── Admin query service ──────────────────────────────────────────────────────

export const auditService = {
  // GET /admin/audit-logs
  async getLogs(filters, pagination) {
    const { action, entityType, userId, dateFrom, dateTo } = filters
    const { page, limit, sortOrder } = pagination
    const skip = (page - 1) * limit

    const where = {}
    if (action)     where.action     = action
    if (entityType) where.entityType = entityType
    if (userId)     where.userId     = userId

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        const from = new Date(dateFrom)
        from.setUTCHours(0, 0, 0, 0)
        where.createdAt.gte = from
      }
      if (dateTo) {
        const to = new Date(dateTo)
        to.setUTCHours(23, 59, 59, 999)
        where.createdAt.lte = to
      }
    }

    const [logs, total] = await Promise.all([
      auditRepository.findMany({ where, skip, take: limit, orderBy: { createdAt: sortOrder } }),
      auditRepository.count(where),
    ])

    return {
      logs,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  },

  // GET /admin/audit-logs/:id
  async getLogById(id) {
    const log = await auditRepository.findById(id)
    if (!log) throw new AppError(MESSAGES.AUDIT_LOG_NOT_FOUND, StatusCodes.NOT_FOUND)
    return log
  },
}
