import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { AppError } from '../../utils/AppError.js'
import { aiService } from '../ai/ai.service.js'
import { profilesRepository } from '../profiles/profiles.repository.js'
import { promptBuilder } from '../../utils/aiPromptBuilder.js'
import { recommendationsRepository } from './recommendations.repository.js'

const MAX_MENTOR_CANDIDATES = 20

// ─── Fallback scoring (no AI) ─────────────────────────────────────────────────

/**
 * Deterministic fallback when Gemini is unavailable.
 * Ranks mentors by rating × 0.5 + normalized sessions × 0.3 + skill count × 0.2
 */
function fallbackScore(mentor) {
  const ratingScore    = (mentor.rating / 5) * 50
  const sessionScore   = Math.min(mentor.totalSessions / 50, 1) * 30
  const skillScore     = Math.min((mentor.skills?.length ?? 0) / 10, 1) * 20
  return Math.round(ratingScore + sessionScore + skillScore)
}

function buildFallbackRecommendations(mentors) {
  return mentors
    .map((m) => ({
      mentorId: m.id,
      score: fallbackScore(m),
      reason: `Matched based on rating (${m.rating}), experience, and skills.`,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const recommendationsService = {
  // POST /ai/recommend-mentors
  async generateRecommendations(learnerId) {
    // 1. Learner profile must exist
    const learnerProfile = await profilesRepository.findLearnerById
      ? await profilesRepository.findLearnerByUserId(learnerId)   // learnerId may be userId OR profileId
      : null

    // Accept both userId and learnerProfileId
    let learner = await profilesRepository.findLearnerByUserId(learnerId)
    if (!learner) {
      // Try as profile ID
      learner = await profilesRepository.findLearnerById
        ? null
        : null
      // Fall back: check if learnerId is a learner profile ID
      const byProfileId = await (async () => {
        try {
          const { prisma } = await import('../../database/prisma.js')
          return prisma.learnerProfile.findUnique({ where: { id: learnerId } })
        } catch { return null }
      })()
      if (byProfileId) learner = byProfileId
    }

    if (!learner) throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)

    // 2. Fetch up to MAX_MENTOR_CANDIDATES mentors (best rated first)
    const mentors = await profilesRepository.findMentorProfiles({
      filters: {},
      pagination: { skip: 0, take: MAX_MENTOR_CANDIDATES },
    })

    if (!mentors.length) {
      throw new AppError(MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    // 3. Attempt AI recommendation — fall back if Gemini fails or not configured
    let aiRecs = null
    try {
      const prompt = promptBuilder.mentorRecommendation(learner, mentors)
      const parsed = await aiService.generateJSONResponse(prompt)

      if (parsed?.recommendations?.length) {
        aiRecs = parsed.recommendations.map((rec) => ({
          mentorId: rec.mentorId,
          score:    Number(rec.score) || 0,
          reason:   rec.reason ?? 'Recommended by AI',
        }))
      }
    } catch {
      // Gemini failed — use deterministic fallback
      aiRecs = null
    }

    const finalRecs = aiRecs ?? buildFallbackRecommendations(mentors)

    // Validate that all mentorIds returned by Gemini actually exist
    const validMentorIds = new Set(mentors.map((m) => m.id))
    const validRecs = finalRecs.filter((r) => validMentorIds.has(r.mentorId))

    if (!validRecs.length) {
      // All Gemini IDs were hallucinated — use fallback
      const fbRecs = buildFallbackRecommendations(mentors)
      validRecs.push(...fbRecs)
    }

    // 4. Clear previous recommendations, store new ones
    await recommendationsRepository.deleteByLearner(learner.id)
    await recommendationsRepository.createMany(
      validRecs.map((r) => ({
        learnerId: learner.id,
        mentorId:  r.mentorId,
        score:     r.score,
        reason:    r.reason,
      })),
    )

    // 5. Return with full mentor details
    return recommendationsRepository.findByLearner(learner.id)
  },

  // GET /ai/recommendations
  async getRecommendations(userId) {
    const learner = await profilesRepository.findLearnerByUserId(userId)
    if (!learner) throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)
    return recommendationsRepository.findByLearner(learner.id)
  },

  // GET /ai/recommendations/:id
  async getRecommendationById(id) {
    const rec = await recommendationsRepository.findById(id)
    if (!rec) throw new AppError(MESSAGES.RECOMMENDATION_NOT_FOUND, StatusCodes.NOT_FOUND)
    return rec
  },

  // DELETE /ai/recommendations
  async deleteRecommendations(userId) {
    const learner = await profilesRepository.findLearnerByUserId(userId)
    if (!learner) throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)
    await recommendationsRepository.deleteByLearner(learner.id)
  },
}
