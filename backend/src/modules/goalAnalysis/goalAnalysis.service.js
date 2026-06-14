import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { AppError } from '../../utils/AppError.js'
import { aiService } from '../ai/ai.service.js'
import { profilesRepository } from '../profiles/profiles.repository.js'
import { promptBuilder } from '../../utils/aiPromptBuilder.js'
import { goalAnalysisRepository } from './goalAnalysis.repository.js'

const MAX_ANALYSES_PER_DAY = 20

// ─── Fallback analysis ────────────────────────────────────────────────────────

function buildFallbackAnalysis(goal) {
  return {
    goal,
    requiredSkills: [
      'Problem Solving',
      'Version Control (Git)',
      'Communication',
      'Self-Learning',
    ],
    roadmap: [
      'Learn the fundamentals related to your goal',
      'Build small projects to apply concepts',
      'Study advanced topics in your chosen area',
      'Work on a complete real-world project',
      'Seek mentorship and peer review',
    ],
    recommendedTechnologies: [
      'Relevant programming languages for your goal',
      'Industry-standard tools and frameworks',
      'Cloud platforms and deployment tools',
    ],
    careerSuggestions: [
      'Internships to gain practical experience',
      'Open source contribution',
      'Build a portfolio with 2-3 strong projects',
      'Network with professionals in your target field',
    ],
    mentorFocusAreas: [
      'Core technical skills',
      'Industry best practices',
      'Career path guidance',
    ],
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const goalAnalysisService = {
  // POST /ai/analyze-goal
  async analyzeGoal(userId, { goal }) {
    // 1. Learner profile must exist
    const learner = await profilesRepository.findLearnerByUserId(userId)
    if (!learner) throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)

    // 2. Daily rate limit
    const todayCount = await goalAnalysisRepository.countTodayByLearner(learner.id)
    if (todayCount >= MAX_ANALYSES_PER_DAY) {
      throw new AppError(
        `Daily limit reached. Maximum ${MAX_ANALYSES_PER_DAY} goal analyses per day.`,
        StatusCodes.TOO_MANY_REQUESTS,
      )
    }

    // 3. Build context-aware prompt
    const prompt = promptBuilder.goalAnalysis(goal, {
      department: learner.department,
      currentGoals: learner.goals,
    })

    // 4. Call Gemini — fall back on any failure
    let analysisData
    try {
      analysisData = await aiService.generateJSONResponse(prompt)

      if (!analysisData?.requiredSkills) {
        throw new Error('Invalid analysis structure from Gemini')
      }
    } catch {
      analysisData = buildFallbackAnalysis(goal)
    }

    // 5. Persist and return
    return goalAnalysisRepository.create({
      learnerId: learner.id,
      goal,
      analysis: analysisData,
    })
  },

  // GET /ai/goal-analyses
  async getAnalyses(userId, pagination) {
    const learner = await profilesRepository.findLearnerByUserId(userId)
    if (!learner) throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)

    const { page, limit, sortBy, sortOrder } = pagination
    const skip = (page - 1) * limit

    const [analyses, total] = await Promise.all([
      goalAnalysisRepository.findByLearner({
        learnerId: learner.id,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      goalAnalysisRepository.countByLearner(learner.id),
    ])

    return {
      analyses,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  },

  // GET /ai/goal-analyses/:id
  async getAnalysisById(userId, analysisId) {
    const analysis = await goalAnalysisRepository.findById(analysisId)
    if (!analysis) throw new AppError(MESSAGES.GOAL_ANALYSIS_NOT_FOUND, StatusCodes.NOT_FOUND)

    const learner = await profilesRepository.findLearnerByUserId(userId)
    if (!learner || analysis.learnerId !== learner.id) {
      throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    }

    return analysis
  },

  // DELETE /ai/goal-analyses/:id
  async deleteAnalysis(userId, analysisId) {
    const analysis = await goalAnalysisRepository.findById(analysisId)
    if (!analysis) throw new AppError(MESSAGES.GOAL_ANALYSIS_NOT_FOUND, StatusCodes.NOT_FOUND)

    const learner = await profilesRepository.findLearnerByUserId(userId)
    if (!learner || analysis.learnerId !== learner.id) {
      throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    }

    await goalAnalysisRepository.delete(analysisId)
  },
}
