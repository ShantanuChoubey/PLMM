import { z } from 'zod'

export const createStudyPlanSchema = z.object({
  goal: z
    .string({ required_error: 'Goal is required' })
    .trim()
    .min(3, 'Goal must be at least 3 characters')
    .max(200, 'Goal must not exceed 200 characters'),
  duration: z
    .number({ invalid_type_error: 'Duration must be a number' })
    .int('Duration must be an integer')
    .min(7, 'Minimum duration is 7 days')
    .max(365, 'Maximum duration is 365 days'),
})

export const studyPlanIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Study plan ID is required'),
})

export const studyPlanQuerySchema = z
  .object({
    sortBy: z.enum(['createdAt', 'goal', 'duration']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    page: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 1))
      .pipe(z.number().int().min(1)),
    limit: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 10))
      .pipe(z.number().int().min(1).max(50)),
  })
  .default({})
