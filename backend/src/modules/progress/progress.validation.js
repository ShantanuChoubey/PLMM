import { z } from 'zod'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const progressValue = z
  .number({ invalid_type_error: 'Progress must be a number' })
  .int('Progress must be an integer')
  .min(0, 'Minimum progress is 0')
  .max(100, 'Maximum progress is 100')

// ─── Create ───────────────────────────────────────────────────────────────────

export const createProgressSchema = z.object({
  skill:    z.string().trim().min(1, 'Skill name is required').max(100, 'Skill name too long'),
  progress: progressValue.default(0),
  notes:    z.string().trim().max(1000, 'Notes too long').optional(),
})

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateProgressSchema = z
  .object({
    progress: progressValue.optional(),
    notes:    z.string().trim().max(1000).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'At least one field is required' })

// ─── Params ───────────────────────────────────────────────────────────────────

export const progressIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Progress record ID is required'),
})

// ─── Query ────────────────────────────────────────────────────────────────────

export const progressQuerySchema = z
  .object({
    status: z
      .enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], {
        errorMap: () => ({
          message: 'Status must be one of: NOT_STARTED, IN_PROGRESS, COMPLETED',
        }),
      })
      .optional(),
    skill: z.string().trim().optional(),
    sortBy: z.enum(['createdAt', 'progress', 'skill']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    page: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 1))
      .pipe(z.number().int().min(1)),
    limit: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 20))
      .pipe(z.number().int().min(1).max(100)),
  })
  .default({})
