import { z } from 'zod'

// ─── Book Session ────────────────────────────────────────────────────────────

export const bookSessionSchema = z.object({
  mentorId: z.string().trim().min(1, 'Mentor ID is required'),
  slotId: z.string().trim().min(1, 'Slot ID is required'),
  topic: z.string().trim().min(3, 'Topic must be at least 3 characters').max(200, 'Topic too long'),
  description: z.string().trim().max(1000, 'Description too long').optional(),
})

// ─── Session ID param ────────────────────────────────────────────────────────

export const sessionIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Session ID is required'),
})

// ─── Query filters ───────────────────────────────────────────────────────────

export const sessionQuerySchema = z
  .object({
    status: z
      .enum(['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'], {
        errorMap: () => ({
          message: 'Status must be one of: PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED',
        }),
      })
      .optional(),
    mentorId: z.string().trim().optional(),
    learnerId: z.string().trim().optional(),
    date: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .optional(),
    page: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 1))
      .pipe(z.number().int().min(1, 'Page must be at least 1')),
    limit: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v, 10) : 20))
      .pipe(z.number().int().min(1).max(100, 'Limit cannot exceed 100')),
  })
  .default({})
