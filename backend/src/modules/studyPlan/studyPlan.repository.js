import { prisma } from '../../database/prisma.js'

export const studyPlanRepository = {
  findById(id) {
    return prisma.studyPlan.findUnique({ where: { id } })
  },

  findByLearner({ learnerId, skip = 0, take = 10, orderBy = { createdAt: 'desc' } } = {}) {
    return prisma.studyPlan.findMany({ where: { learnerId }, skip, take, orderBy })
  },

  countByLearner(learnerId) {
    return prisma.studyPlan.count({ where: { learnerId } })
  },

  /**
   * Count plans created today for rate limiting (max 10/day).
   */
  countTodayByLearner(learnerId) {
    const start = new Date()
    start.setUTCHours(0, 0, 0, 0)
    return prisma.studyPlan.count({
      where: { learnerId, createdAt: { gte: start } },
    })
  },

  create(data) {
    return prisma.studyPlan.create({ data })
  },

  delete(id) {
    return prisma.studyPlan.delete({ where: { id } })
  },
}
