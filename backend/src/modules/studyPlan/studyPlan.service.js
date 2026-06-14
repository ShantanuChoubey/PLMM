import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { AppError } from '../../utils/AppError.js'
import { aiService } from '../ai/ai.service.js'
import { profilesRepository } from '../profiles/profiles.repository.js'
import { promptBuilder } from '../../utils/aiPromptBuilder.js'
import { studyPlanRepository } from './studyPlan.repository.js'

const MAX_PLANS_PER_DAY = 10

// ─── Fallback plan generator ──────────────────────────────────────────────────

function buildFallbackPlan(goal, duration) {
  const weeks = Math.max(1, Math.ceil(duration / 7))
  const phases = ['Basics & Fundamentals', 'Core Concepts', 'Hands-on Projects', 'Advanced Topics', 'Review & Polish']

  const generatedWeeks = Array.from({ length: weeks }, (_, i) => ({
    week: i + 1,
    focus: phases[i % phases.length],
    topics: [
      `${goal} — ${phases[i % phases.length]}`,
      'Practice exercises',
    ],
    milestone: i === weeks - 1
      ? `Complete ${goal} learning path`
      : `Finish ${phases[i % phases.length]} for ${goal}`,
  }))

  return {
    goal,
    duration,
    weeks: generatedWeeks,
    resources: [
      `Official ${goal} documentation`,
      `YouTube tutorials for ${goal}`,
      `Practice projects on GitHub`,
    ],
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const studyPlanService = {
  // POST /ai/study-plan
  async generateStudyPlan(userId, { goal, duration }) {
    // 1. Learner profile must exist
    const learner = await profilesRepository.findLearnerByUserId(userId)
    if (!learner) throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)

    // 2. Daily rate limit — max 10 plans per learner per day
    const todayCount = await studyPlanRepository.countTodayByLearner(learner.id)
    if (todayCount >= MAX_PLANS_PER_DAY) {
      throw new AppError(
        `Daily limit reached. Maximum ${MAX_PLANS_PER_DAY} study plans can be generated per day.`,
        StatusCodes.TOO_MANY_REQUESTS,
      )
    }

    // 3. Build context-aware prompt using learner profile
    const prompt = promptBuilder.studyPlan(goal, duration, {
      department: learner.department,
      currentGoals: learner.goals,
    })

    // 4. Call Gemini — fall back to template on any failure
    let planData
    try {
      planData = await aiService.generateJSONResponse(prompt)

      // Validate the JSON structure
      if (!planData?.weeks?.length) {
        throw new Error('Invalid plan structure from Gemini')
      }
    } catch {
      planData = buildFallbackPlan(goal, duration)
    }

    // 5. Persist and return
    return studyPlanRepository.create({
      learnerId: learner.id,
      goal,
      duration,
      plan: planData,
    })
  },

  // GET /ai/study-plans
  async getStudyPlans(userId, pagination) {
    const learner = await profilesRepository.findLearnerByUserId(userId)
    if (!learner) throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)

    const { page, limit, sortBy, sortOrder } = pagination
    const skip = (page - 1) * limit

    const [plans, total] = await Promise.all([
      studyPlanRepository.findByLearner({
        learnerId: learner.id,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      studyPlanRepository.countByLearner(learner.id),
    ])

    return {
      plans,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  },

  // GET /ai/study-plans/:id
  async getStudyPlanById(userId, planId) {
    const plan = await studyPlanRepository.findById(planId)
    if (!plan) throw new AppError(MESSAGES.STUDY_PLAN_NOT_FOUND, StatusCodes.NOT_FOUND)

    // Ownership check
    const learner = await profilesRepository.findLearnerByUserId(userId)
    if (!learner || plan.learnerId !== learner.id) {
      throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    }

    return plan
  },

  // DELETE /ai/study-plans/:id
  async deleteStudyPlan(userId, planId) {
    const plan = await studyPlanRepository.findById(planId)
    if (!plan) throw new AppError(MESSAGES.STUDY_PLAN_NOT_FOUND, StatusCodes.NOT_FOUND)

    const learner = await profilesRepository.findLearnerByUserId(userId)
    if (!learner || plan.learnerId !== learner.id) {
      throw new AppError(MESSAGES.FORBIDDEN, StatusCodes.FORBIDDEN)
    }

    await studyPlanRepository.delete(planId)
  },
}
