import { prisma } from '../../database/prisma.js'

export const notificationsRepository = {
  // ─── Find ──────────────────────────────────────────────────────────────────

  findById(id) {
    return prisma.notification.findUnique({ where: { id } })
  },

  findMany({ where = {}, skip = 0, take = 20, orderBy = { createdAt: 'desc' } } = {}) {
    return prisma.notification.findMany({ where, skip, take, orderBy })
  },

  count(where = {}) {
    return prisma.notification.count({ where })
  },

  countUnread(userId) {
    return prisma.notification.count({ where: { userId, isRead: false } })
  },

  // ─── Write ─────────────────────────────────────────────────────────────────

  create(data) {
    return prisma.notification.create({ data })
  },

  markAsRead(id) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })
  },

  /**
   * Mark all unread notifications for a user as read.
   * Returns the count of updated records.
   */
  async markAllAsRead(userId) {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
    return result.count
  },

  delete(id) {
    return prisma.notification.delete({ where: { id } })
  },

  deleteMany(where) {
    return prisma.notification.deleteMany({ where })
  },
}
