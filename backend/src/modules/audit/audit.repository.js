import { prisma } from '../../database/prisma.js'

const auditInclude = {
  user: {
    select: { id: true, name: true, email: true, role: true },
  },
}

export const auditRepository = {
  findById(id) {
    return prisma.auditLog.findUnique({ where: { id }, include: auditInclude })
  },

  findMany({ where = {}, skip = 0, take = 20, orderBy = { createdAt: 'desc' } } = {}) {
    return prisma.auditLog.findMany({ where, skip, take, orderBy, include: auditInclude })
  },

  count(where = {}) {
    return prisma.auditLog.count({ where })
  },

  /**
   * Create an audit log entry.
   * Non-fatal — errors are swallowed so audit failures never break business logic.
   */
  async create(data) {
    try {
      return await prisma.auditLog.create({ data })
    } catch {
      // Audit failure must never crash the application
      return null
    }
  },
}
