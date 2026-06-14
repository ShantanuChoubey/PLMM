import { z } from 'zod'

export const analyzeGoalSchema = z.object({
  goal: z
    .string({ required_error: 'Goal is required' })
    .trim()
    .min(5, 'Goal must be at least 5 characters')
    .max(300, 'Goal must not exceed 300 characters'),
})

export const goalAnalysisIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Goal analysis ID is required'),
})

export const goalAnalysisQuerySchema = z
  .object({
    sortBy: z.enum(['createdAt', 'goal']).default('createdAt'),
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
