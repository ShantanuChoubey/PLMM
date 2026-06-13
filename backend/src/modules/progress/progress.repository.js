import { prisma } from '../../database/prisma.js'

export const progressRepository = {
  // ─── Find ──────────────────────────────────────────────────────────────────

  findById(id) {
    return prisma.progressRecord.findUnique({ where: { id } })
  },

  findByLearnerAndSkill(learnerId, skill) {
    return prisma.progressRecord.findUnique({
      where: { learnerId_skill: { learnerId, skill } },
    })
  },

  findMany({ where = {}, skip = 0, take = 20, orderBy = { createdAt: 'desc' } } = {}) {
    return prisma.progressRecord.findMany({ where, skip, take, orderBy })
  },

  count(where = {}) {
    return prisma.progressRecord.count({ where })
  },

  // ─── Aggregates for summary ───────────────────────────────────────────────

  async getSummary(learnerId) {
    const [total, completed, inProgress, avg] = await Promise.all([
      prisma.progressRecord.count({ where: { learnerId } }),
      prisma.progressRecord.count({ where: { learnerId, status: 'COMPLETED' } }),
      prisma.progressRecord.count({ where: { learnerId, status: 'IN_PROGRESS' } }),
      prisma.progressRecord.aggregate({
        where: { learnerId },
        _avg: { progress: true },
      }),
    ])

    return {
      totalSkills: total,
      completedSkills: completed,
      inProgressSkills: inProgress,
      notStartedSkills: total - completed - inProgress,
      averageProgress: avg._avg.progress ? Math.round(avg._avg.progress) : 0,
    }
  },

  // ─── Write ─────────────────────────────────────────────────────────────────

  create(data) {
    return prisma.progressRecord.create({ data })
  },

  update(id, data) {
    return prisma.progressRecord.update({ where: { id }, data })
  },

  delete(id) {
    return prisma.progressRecord.delete({ where: { id } })
  },
}
