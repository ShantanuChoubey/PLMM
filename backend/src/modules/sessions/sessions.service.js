import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { ROLES } from '../../constants/roles.js'
import { AppError } from '../../utils/AppError.js'
import { availabilityRepository } from '../availability/availability.repository.js'
import { profilesRepository } from '../profiles/profiles.repository.js'
import { sessionsRepository } from './sessions.repository.js'

// ─── Business Utilities ──────────────────────────────────────────────────────

/**
 * A slot is bookable when it exists, belongs to the target mentor,
 * and is not already booked.
 */
export function isSlotAvailable(slot, mentorProfileId) {
  return slot && slot.mentorId === mentorProfileId && !slot.isBooked
}

/**
 * A session can be accepted/rejected only when it is PENDING.
 */
export function canAcceptSession(session) {
  return session?.status === 'PENDING'
}

/**
 * A session can be completed only when it is ACCEPTED.
 */
export function canCompleteSession(session) {
  return session?.status === 'ACCEPTED'
}

/**
 * A session can be cancelled when it is PENDING or ACCEPTED.
 */
export function canCancelSession(session) {
  return session?.status === 'PENDING' || session?.status === 'ACCEPTED'
}

// ─── Profile helpers ─────────────────────────────────────────────────────────

async function getLearnerProfileOrFail(userId) {
  const profile = await profilesRepository.findLearnerByUserId(userId)
  if (!profile) {
    throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)
  }
  return profile
}

async function getMentorProfileOrFail(userId) {
  const profile = await profilesRepository.findMentorByUserId(userId)
  if (!profile) {
    throw new AppError(MESSAGES.MENTOR_PROFILE_REQUIRED, StatusCodes.BAD_REQUEST)
  }
  return profile
}

// ─── Build where clause based on role + filters ───────────────────────────────

async function buildWhereClause(user, filters) {
  const { status, mentorId, learnerId, date } = filters
  const where = {}

  // Role-based scoping
  if (user.role === ROLES.LEARNER) {
    const learnerProfile = await profilesRepository.findLearnerByUserId(user.id)
    if (!learnerProfile) return null // no profile → no sessions
    where.learnerId = learnerProfile.id
  } else if (user.role === ROLES.PEER_MENTOR) {
    const mentorProfile = await profilesRepository.findMentorByUserId(user.id)
    if (!mentorProfile) return null
    where.mentorId = mentorProfile.id
  }
  // FACULTY_MENTOR and ADMIN can see everything (no role scope added)

  if (status) where.status = status
  if (mentorId) where.mentorId = mentorId
  if (learnerId) where.learnerId = learnerId

  if (date) {
    const start = new Date(date)
    start.setUTCHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setUTCHours(23, 59, 59, 999)
    where.createdAt = { gte: start, lte: end }
  }

  return where
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const sessionsService = {
  // POST /sessions — Learner books a session
  async bookSession(userId, { mentorId, slotId, topic, description }) {
    // 1. Learner must have a profile
    const learnerProfile = await getLearnerProfileOrFail(userId)

    // 2. Mentor profile must exist (accept by profile ID directly)
    const mentorProfile = await profilesRepository.findMentorById(mentorId)
    if (!mentorProfile) {
      throw new AppError(MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    // 3. Slot must exist, belong to mentor, and be unbooked
    const slot = await availabilityRepository.findById(slotId)
    if (!isSlotAvailable(slot, mentorProfile.id)) {
      if (!slot || slot.mentorId !== mentorProfile.id) {
        throw new AppError(MESSAGES.SLOT_NOT_FOUND, StatusCodes.NOT_FOUND)
      }
      throw new AppError(MESSAGES.SLOT_ALREADY_BOOKED, StatusCodes.CONFLICT)
    }

    // 4. No double-booking guard (extra safety beyond isBooked flag)
    const existingBooking = await sessionsRepository.findActiveSessionBySlot(slotId)
    if (existingBooking) {
      throw new AppError(MESSAGES.SLOT_ALREADY_BOOKED, StatusCodes.CONFLICT)
    }

    return sessionsRepository.createAndBookSlot({
      learnerId: learnerProfile.id,
      mentorId: mentorProfile.id,
      slotId,
      topic,
      description,
    })
  },

  // GET /sessions — Role-aware list
  async getSessions(user, filters, pagination) {
    const where = await buildWhereClause(user, filters)
    if (where === null) return { sessions: [], pagination: { total: 0, page: pagination.page, limit: pagination.limit, totalPages: 0 } }

    const { page, limit } = pagination
    const skip = (page - 1) * limit

    const [sessions, total] = await Promise.all([
      sessionsRepository.findMany({ where, skip, take: limit }),
      sessionsRepository.count(where),
    ])

    return {
      sessions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  },

  // GET /sessions/:id — Full session details
  async getSessionById(user, sessionId) {
    const session = await sessionsRepository.findById(sessionId)
    if (!session) {
      throw new AppError(MESSAGES.SESSION_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    // Ownership check: learners and mentors can only see their own sessions
    if (user.role === ROLES.LEARNER) {
      const learnerProfile = await profilesRepository.findLearnerByUserId(user.id)
      if (!learnerProfile || session.learnerId !== learnerProfile.id) {
        throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
      }
    } else if (user.role === ROLES.PEER_MENTOR) {
      const mentorProfile = await profilesRepository.findMentorByUserId(user.id)
      if (!mentorProfile || session.mentorId !== mentorProfile.id) {
        throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
      }
    }

    return session
  },

  // PATCH /sessions/:id/accept — Mentor accepts
  async acceptSession(userId, sessionId) {
    const mentorProfile = await getMentorProfileOrFail(userId)
    const session = await sessionsRepository.findRawById(sessionId)

    if (!session) throw new AppError(MESSAGES.SESSION_NOT_FOUND, StatusCodes.NOT_FOUND)
    if (session.mentorId !== mentorProfile.id) throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    if (!canAcceptSession(session)) throw new AppError(MESSAGES.SESSION_INVALID_STATUS, StatusCodes.UNPROCESSABLE_ENTITY)

    return sessionsRepository.updateStatus(sessionId, 'ACCEPTED')
  },

  // PATCH /sessions/:id/reject — Mentor rejects
  async rejectSession(userId, sessionId) {
    const mentorProfile = await getMentorProfileOrFail(userId)
    const session = await sessionsRepository.findRawById(sessionId)

    if (!session) throw new AppError(MESSAGES.SESSION_NOT_FOUND, StatusCodes.NOT_FOUND)
    if (session.mentorId !== mentorProfile.id) throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    if (!canAcceptSession(session)) throw new AppError(MESSAGES.SESSION_INVALID_STATUS, StatusCodes.UNPROCESSABLE_ENTITY)

    const updated = await sessionsRepository.updateStatus(sessionId, 'REJECTED')
    await sessionsRepository.freeSlot(session.slotId)
    return updated
  },

  // PATCH /sessions/:id/cancel — Learner, Mentor, or Admin cancels
  async cancelSession(user, sessionId) {
    const session = await sessionsRepository.findRawById(sessionId)
    if (!session) throw new AppError(MESSAGES.SESSION_NOT_FOUND, StatusCodes.NOT_FOUND)

    // Ownership check
    if (user.role === ROLES.LEARNER) {
      const learnerProfile = await profilesRepository.findLearnerByUserId(user.id)
      if (!learnerProfile || session.learnerId !== learnerProfile.id) {
        throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
      }
    } else if (user.role === ROLES.PEER_MENTOR) {
      const mentorProfile = await profilesRepository.findMentorByUserId(user.id)
      if (!mentorProfile || session.mentorId !== mentorProfile.id) {
        throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
      }
    }
    // ADMIN and FACULTY_MENTOR can cancel any session

    if (!canCancelSession(session)) {
      throw new AppError(MESSAGES.SESSION_INVALID_STATUS, StatusCodes.UNPROCESSABLE_ENTITY)
    }

    const updated = await sessionsRepository.updateStatus(sessionId, 'CANCELLED')
    await sessionsRepository.freeSlot(session.slotId)
    return updated
  },

  // PATCH /sessions/:id/complete — Mentor marks as complete
  async completeSession(userId, sessionId) {
    const mentorProfile = await getMentorProfileOrFail(userId)
    const session = await sessionsRepository.findRawById(sessionId)

    if (!session) throw new AppError(MESSAGES.SESSION_NOT_FOUND, StatusCodes.NOT_FOUND)
    if (session.mentorId !== mentorProfile.id) throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    if (!canCompleteSession(session)) throw new AppError(MESSAGES.SESSION_INVALID_STATUS, StatusCodes.UNPROCESSABLE_ENTITY)

    const updated = await sessionsRepository.updateStatus(sessionId, 'COMPLETED', {
      completedAt: new Date(),
    })

    // Increment mentor's completed session count
    await sessionsRepository.incrementMentorSessions(mentorProfile.id)

    return updated
  },
}
