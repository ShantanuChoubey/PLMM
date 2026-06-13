import { prisma } from '../../database/prisma.js'

const reviewInclude = {
  learner: {
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  },
}

export const reviewsRepository = {
  // ─── Find ──────────────────────────────────────────────────────────────────

  findById(id) {
    return prisma.review.findUnique({ where: { id }, include: reviewInclude })
  },

  findRawById(id) {
    return prisma.review.findUnique({ where: { id } })
  },

  findBySessionId(sessionId) {
    return prisma.review.findUnique({ where: { sessionId }, include: reviewInclude })
  },

  findByMentorId(mentorId) {
    return prisma.review.findMany({
      where: { mentorId },
      include: reviewInclude,
      orderBy: { createdAt: 'desc' },
    })
  },

  // ─── Aggregate ─────────────────────────────────────────────────────────────

  async getRatingStats(mentorId) {
    const agg = await prisma.review.aggregate({
      where: { mentorId },
      _avg: { rating: true },
      _count: { id: true },
    })

    // Rating distribution 1–5
    const distribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { mentorId },
      _count: { rating: true },
      orderBy: { rating: 'asc' },
    })

    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    distribution.forEach((d) => { dist[d.rating] = d._count.rating })

    return {
      averageRating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : 0,
      totalReviews: agg._count.id,
      distribution: dist,
    }
  },

  // ─── Write ─────────────────────────────────────────────────────────────────

  create(data) {
    return prisma.review.create({ data, include: reviewInclude })
  },

  update(id, data) {
    return prisma.review.update({ where: { id }, data, include: reviewInclude })
  },

  delete(id) {
    return prisma.review.delete({ where: { id } })
  },

  // ─── Recalculate mentor rating after create/update/delete ─────────────────

  async recalculateMentorRating(mentorId) {
    const stats = await prisma.review.aggregate({
      where: { mentorId },
      _avg: { rating: true },
      _count: { id: true },
    })

    await prisma.mentorProfile.update({
      where: { id: mentorId },
      data: {
        rating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 0,
      },
    })
  },
}
