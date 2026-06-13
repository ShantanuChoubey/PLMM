import { prisma } from '../../database/prisma.js'

const recInclude = {
  mentor: {
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
      skills: { include: { skill: true } },
    },
  },
}

export const recommendationsRepository = {
  findById(id) {
    return prisma.mentorRecommendation.findUnique({ where: { id }, include: recInclude })
  },

  findByLearner(learnerId) {
    return prisma.mentorRecommendation.findMany({
      where: { learnerId },
      include: recInclude,
      orderBy: { score: 'desc' },
    })
  },

  createMany(records) {
    return prisma.mentorRecommendation.createMany({ data: records })
  },

  // Delete all previous recommendations for a learner before regenerating
  deleteByLearner(learnerId) {
    return prisma.mentorRecommendation.deleteMany({ where: { learnerId } })
  },

  // Admin: get all recommendations
  findAll({ skip = 0, take = 50 } = {}) {
    return prisma.mentorRecommendation.findMany({
      skip,
      take,
      include: recInclude,
      orderBy: { score: 'desc' },
    })
  },
}
