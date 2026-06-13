import { MESSAGES } from '../../constants/messages.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { sendSuccess } from '../../utils/response.js'
import { notificationsService } from './notifications.service.js'

// GET /api/v1/notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const { isRead, type, sortOrder, page, limit } = req.validated?.query ?? req.query

  const result = await notificationsService.getUserNotifications(
    req.user.id,
    { isRead, type },
    { page: page ?? 1, limit: limit ?? 20, sortOrder: sortOrder ?? 'desc' },
  )

  return sendSuccess(res, { data: result })
})

// GET /api/v1/notifications/:id
export const getNotificationById = asyncHandler(async (req, res) => {
  const notif = await notificationsService.getNotificationById(
    req.user.id,
    req.params.id,
    req.user.role,
  )
  return sendSuccess(res, { data: { notification: notif } })
})

// PATCH /api/v1/notifications/:id/read
export const markAsRead = asyncHandler(async (req, res) => {
  const notif = await notificationsService.markAsRead(req.user.id, req.params.id)
  return sendSuccess(res, {
    message: MESSAGES.NOTIFICATION_MARKED_READ,
    data: { notification: notif },
  })
})

// PATCH /api/v1/notifications/read-all
export const markAllAsRead = asyncHandler(async (req, res) => {
  const count = await notificationsService.markAllAsRead(req.user.id)
  return sendSuccess(res, {
    message: MESSAGES.NOTIFICATIONS_ALL_READ,
    data: { updatedCount: count },
  })
})

// DELETE /api/v1/notifications/:id
export const deleteNotification = asyncHandler(async (req, res) => {
  await notificationsService.deleteNotification(req.user.id, req.params.id, req.user.role)
  return sendSuccess(res, { message: MESSAGES.NOTIFICATION_DELETED })
})
