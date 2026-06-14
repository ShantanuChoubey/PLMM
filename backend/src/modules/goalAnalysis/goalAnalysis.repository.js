import { prisma } from '../../database/prisma.js'

export const goalAnalysisRepository = {
  findById(id) {
    return prisma.goalAnalysis.findUnique({ where: { id } })
  },

  findByLearner({ learnerId, skip = 0, take = 10, orderBy = { createdAt: 'desc' } } = {}) {
    return prisma.goalAnalysis.findMany({ where: { learnerId }, skip, take, orderBy })
  },

  countByLearner(learnerId) {
    return prisma.goalAnalysis.count({ where: { learnerId } })
  },

  countTodayByLearner(learnerId) {
    const start = new Date()
    start.setUTCHours(0, 0, 0, 0)
    return prisma.goalAnalysis.count({
      where: { learnerId, createdAt: { gte: start } },
    })
  },

  create(data) {
    return prisma.goalAnalysis.create({ data })
  },

  delete(id) {
    return prisma.goalAnalysis.delete({ where: { id } })
  },
}
