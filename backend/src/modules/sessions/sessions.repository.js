import { prisma } from '../../database/prisma.js'

// ─── Includes ────────────────────────────────────────────────────────────────

const sessionInclude = {
  learner: {
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  },
  mentor: {
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true },
      },
      skills: {
        include: { skill: true },
      },
    },
  },
  slot: true,
}

// ─── Repository ──────────────────────────────────────────────────────────────

export const sessionsRepository = {
  /**
   * Find a session by its primary key with full relations.
   */
  findById(id) {
    return prisma.session.findUnique({
      where: { id },
      include: sessionInclude,
    })
  },

  /**
   * Find a raw session (no relations) — used for ownership/status checks.
   */
  findRawById(id) {
    return prisma.session.findUnique({ where: { id } })
  },

  /**
   * Check whether a slot already has an active booking.
   * Active = PENDING or ACCEPTED.
   */
  findActiveSessionBySlot(slotId) {
    return prisma.session.findFirst({
      where: {
        slotId,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    })
  },

  /**
   * Paginated list with optional filters.
   * @param {object} options
   * @param {object} options.where   - Prisma where clause
   * @param {number} options.skip
   * @param {number} options.take
   */
  findMany({ where = {}, skip = 0, take = 20 } = {}) {
    return prisma.session.findMany({
      where,
      skip,
      take,
      include: sessionInclude,
      orderBy: { createdAt: 'desc' },
    })
  },

  /**
   * Count sessions matching a where clause (for pagination metadata).
   */
  count(where = {}) {
    return prisma.session.count({ where })
  },

  /**
   * Create a new session and mark the slot as booked.
   * Uses sequential operations with manual rollback to avoid
   * interactive-transaction timeout issues on serverless DBs (Neon).
   */
  async createAndBookSlot({ learnerId, mentorId, slotId, topic, description }) {
    // Step 1: create the session record
    const session = await prisma.session.create({
      data: {
        learnerId,
        mentorId,
        slotId,
        topic,
        description,
        status: 'PENDING',
      },
      include: sessionInclude,
    })

    // Step 2: mark the slot as booked (rollback session if this fails)
    try {
      await prisma.availabilitySlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      })
    } catch (err) {
      // Best-effort rollback: delete the session so the slot stays clean
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {})
      throw err
    }

    return session
  },

  /**
   * Update session status and optionally set timestamps.
   */
  updateStatus(id, status, extra = {}) {
    return prisma.session.update({
      where: { id },
      data: { status, ...extra },
      include: sessionInclude,
    })
  },

  /**
   * Free the slot tied to a session (used on reject / cancel).
   */
  async freeSlot(slotId) {
    return prisma.availabilitySlot.update({
      where: { id: slotId },
      data: { isBooked: false },
    })
  },

  /**
   * Increment totalSessions on a MentorProfile atomically.
   */
  incrementMentorSessions(mentorId) {
    return prisma.mentorProfile.update({
      where: { id: mentorId },
      data: { totalSessions: { increment: 1 } },
    })
  },
}
