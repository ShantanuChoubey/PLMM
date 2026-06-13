import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { ROLES } from '../../constants/roles.js'
import { AppError } from '../../utils/AppError.js'
import { notificationsRepository } from './notifications.repository.js'

// ─── Core Service ─────────────────────────────────────────────────────────────

export const notificationsService = {
  /**
   * Create a notification for a user.
   * Called internally by other modules.
   */
  async createNotification({ userId, title, message, type = 'SYSTEM', metadata = null }) {
    return notificationsRepository.create({
      userId,
      title,
      message,
      type,
      metadata,
    })
  },

  /**
   * Get paginated notifications for the authenticated user.
   */
  async getUserNotifications(userId, filters, pagination) {
    const { isRead, type } = filters
    const { page, limit, sortOrder } = pagination
    const skip = (page - 1) * limit

    const where = { userId }
    if (isRead !== undefined) where.isRead = isRead
    if (type)                 where.type   = type

    const [notifications, total, unreadCount] = await Promise.all([
      notificationsRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
      }),
      notificationsRepository.count(where),
      notificationsRepository.countUnread(userId),
    ])

    return {
      notifications,
      unreadCount,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  },

  /**
   * Get a single notification — user can only access their own.
   */
  async getNotificationById(userId, notifId, userRole) {
    const notif = await notificationsRepository.findById(notifId)
    if (!notif) throw new AppError(MESSAGES.NOTIFICATION_NOT_FOUND, StatusCodes.NOT_FOUND)

    if (userRole !== ROLES.ADMIN && notif.userId !== userId) {
      throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    }

    return notif
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(userId, notifId) {
    const notif = await notificationsRepository.findById(notifId)
    if (!notif) throw new AppError(MESSAGES.NOTIFICATION_NOT_FOUND, StatusCodes.NOT_FOUND)
    if (notif.userId !== userId) throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)

    return notificationsRepository.markAsRead(notifId)
  },

  /**
   * Mark all of a user's unread notifications as read.
   * Returns the count of updated records.
   */
  async markAllAsRead(userId) {
    return notificationsRepository.markAllAsRead(userId)
  },

  /**
   * Delete a notification — owner or admin.
   */
  async deleteNotification(userId, notifId, userRole) {
    const notif = await notificationsRepository.findById(notifId)
    if (!notif) throw new AppError(MESSAGES.NOTIFICATION_NOT_FOUND, StatusCodes.NOT_FOUND)

    const isOwner = notif.userId === userId
    const isAdmin = userRole === ROLES.ADMIN
    if (!isOwner && !isAdmin) throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)

    await notificationsRepository.delete(notifId)
  },

  /**
   * Count unread notifications for a user.
   */
  async countUnread(userId) {
    return notificationsRepository.countUnread(userId)
  },
}

// ─── Event Helpers (architecture ready — not yet wired to triggers) ───────────

/**
 * These helpers are designed to be called by other services when events occur.
 * Example: call notifySessionBooked() inside sessionsService.bookSession()
 * when notification delivery is required.
 */

export async function notifySessionBooked({ learnerUserId, mentorUserId, sessionId, topic }) {
  await Promise.all([
    notificationsService.createNotification({
      userId: mentorUserId,
      title: 'New Session Request',
      message: `A learner has requested a session on "${topic}"`,
      type: 'SESSION_BOOKED',
      metadata: { sessionId },
    }),
    notificationsService.createNotification({
      userId: learnerUserId,
      title: 'Session Request Sent',
      message: `Your session request on "${topic}" has been sent to the mentor`,
      type: 'SESSION_BOOKED',
      metadata: { sessionId },
    }),
  ])
}

export async function notifySessionAccepted({ learnerUserId, sessionId, topic }) {
  return notificationsService.createNotification({
    userId: learnerUserId,
    title: 'Session Accepted',
    message: `Your session on "${topic}" has been accepted`,
    type: 'SESSION_ACCEPTED',
    metadata: { sessionId },
  })
}

export async function notifySessionRejected({ learnerUserId, sessionId, topic }) {
  return notificationsService.createNotification({
    userId: learnerUserId,
    title: 'Session Rejected',
    message: `Your session request on "${topic}" was not accepted`,
    type: 'SESSION_REJECTED',
    metadata: { sessionId },
  })
}

export async function notifySessionCancelled({ recipientUserId, sessionId, topic }) {
  return notificationsService.createNotification({
    userId: recipientUserId,
    title: 'Session Cancelled',
    message: `The session on "${topic}" has been cancelled`,
    type: 'SESSION_CANCELLED',
    metadata: { sessionId },
  })
}

export async function notifySessionCompleted({ learnerUserId, sessionId, topic }) {
  return notificationsService.createNotification({
    userId: learnerUserId,
    title: 'Session Completed',
    message: `Your session on "${topic}" is now complete. Leave a review!`,
    type: 'SESSION_COMPLETED',
    metadata: { sessionId },
  })
}

export async function notifyGroupJoined({ userId, groupId, groupName }) {
  return notificationsService.createNotification({
    userId,
    title: 'Joined Study Group',
    message: `You have joined the study group "${groupName}"`,
    type: 'GROUP_JOINED',
    metadata: { groupId },
  })
}

export async function notifyResourceUploaded({ groupMemberUserIds, uploaderId, resourceId, title }) {
  const notifications = groupMemberUserIds
    .filter((uid) => uid !== uploaderId)
    .map((uid) =>
      notificationsService.createNotification({
        userId: uid,
        title: 'New Resource Shared',
        message: `A new resource "${title}" has been added to your group`,
        type: 'RESOURCE_UPLOADED',
        metadata: { resourceId },
      }),
    )
  await Promise.all(notifications)
}

export async function notifyReviewReceived({ mentorUserId, reviewId, rating }) {
  return notificationsService.createNotification({
    userId: mentorUserId,
    title: 'New Review Received',
    message: `You received a ${rating}-star review`,
    type: 'REVIEW_RECEIVED',
    metadata: { reviewId },
  })
}
