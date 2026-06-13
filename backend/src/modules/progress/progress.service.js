import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { ROLES } from '../../constants/roles.js'
import { AppError } from '../../utils/AppError.js'
import { profilesRepository } from '../profiles/profiles.repository.js'
import { progressRepository } from './progress.repository.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derive status from a numeric progress value.
 * 0 = NOT_STARTED, 1–99 = IN_PROGRESS, 100 = COMPLETED
 */
function deriveStatus(progress) {
  if (progress === 0)   return 'NOT_STARTED'
  if (progress === 100) return 'COMPLETED'
  return 'IN_PROGRESS'
}

async function getLearnerProfileOrFail(userId) {
  const profile = await profilesRepository.findLearnerByUserId(userId)
  if (!profile) throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)
  return profile
}

async function getRecordOrFail(id) {
  const record = await progressRepository.findById(id)
  if (!record) throw new AppError(MESSAGES.PROGRESS_NOT_FOUND, StatusCodes.NOT_FOUND)
  return record
}

// ─── Achievement utility (architecture ready — storage not yet implemented) ───

/**
 * calculateAchievements()
 * Evaluates which achievement milestones a learner has reached.
 * Returns an array of earned achievement keys.
 * Designed to be stored/displayed in a future achievements module.
 *
 * @param {object} summary - result of progressRepository.getSummary()
 * @returns {string[]}
 */
export function calculateAchievements(summary) {
  const achievements = []
  const { completedSkills } = summary

  if (completedSkills >= 1)  achievements.push('FIRST_SKILL_COMPLETED')
  if (completedSkills >= 5)  achievements.push('FIVE_SKILLS_COMPLETED')
  if (completedSkills >= 10) achievements.push('TEN_SKILLS_COMPLETED')

  return achievements
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const progressService = {
  // POST /progress
  async createRecord(userId, { skill, progress = 0, notes }) {
    const learnerProfile = await getLearnerProfileOrFail(userId)

    // One record per skill per learner
    const existing = await progressRepository.findByLearnerAndSkill(learnerProfile.id, skill)
    if (existing) {
      throw new AppError(
        `Progress record for "${skill}" already exists. Use PATCH to update it.`,
        StatusCodes.CONFLICT,
      )
    }

    return progressRepository.create({
      learnerId: learnerProfile.id,
      skill,
      progress,
      notes,
      status: deriveStatus(progress),
    })
  },

  // GET /progress
  async getRecords(userId, filters, pagination) {
    const learnerProfile = await getLearnerProfileOrFail(userId)
    const { status, skill } = filters
    const { page, limit, sortBy, sortOrder } = pagination
    const skip = (page - 1) * limit

    const where = { learnerId: learnerProfile.id }
    if (status) where.status = status
    if (skill)  where.skill  = { contains: skill, mode: 'insensitive' }

    const [records, total] = await Promise.all([
      progressRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      progressRepository.count(where),
    ])

    return {
      records,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  },

  // GET /progress/:id
  async getRecordById(userId, recordId, userRole) {
    const record = await getRecordOrFail(recordId)

    if (userRole !== ROLES.ADMIN) {
      const learnerProfile = await getLearnerProfileOrFail(userId)
      if (record.learnerId !== learnerProfile.id) {
        throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
      }
    }

    return record
  },

  // PATCH /progress/:id
  async updateRecord(userId, recordId, { progress, notes }) {
    const learnerProfile = await getLearnerProfileOrFail(userId)
    const record = await getRecordOrFail(recordId)

    if (record.learnerId !== learnerProfile.id) {
      throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    }

    const newProgress = progress !== undefined ? progress : record.progress
    const newStatus   = deriveStatus(newProgress)

    return progressRepository.update(recordId, {
      ...(progress !== undefined && { progress: newProgress }),
      ...(notes    !== undefined && { notes }),
      status: newStatus,
    })
  },

  // DELETE /progress/:id
  async deleteRecord(userId, recordId, userRole) {
    const record = await getRecordOrFail(recordId)

    if (userRole !== ROLES.ADMIN) {
      const learnerProfile = await getLearnerProfileOrFail(userId)
      if (record.learnerId !== learnerProfile.id) {
        throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
      }
    }

    await progressRepository.delete(recordId)
  },

  // Summary for dashboard use
  async getProgressSummary(userId) {
    const learnerProfile = await getLearnerProfileOrFail(userId)
    const summary = await progressRepository.getSummary(learnerProfile.id)
    const achievements = calculateAchievements(summary)
    return { ...summary, achievements }
  },
}
