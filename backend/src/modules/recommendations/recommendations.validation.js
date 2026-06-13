import { z } from 'zod'

export const generateRecommendationsSchema = z.object({
  learnerId: z.string().trim().min(1, 'Learner ID is required'),
})

export const recommendationIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Recommendation ID is required'),
})
