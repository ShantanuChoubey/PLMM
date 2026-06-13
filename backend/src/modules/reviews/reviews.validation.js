import { z } from 'zod'

// ─── Create Review ────────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  sessionId: z.string().trim().min(1, 'Session ID is required'),
  mentorId:  z.string().trim().min(1, 'Mentor ID is required'),
  rating: z
    .number({ invalid_type_error: 'Rating must be a number' })
    .int('Rating must be an integer')
    .min(1, 'Minimum rating is 1')
    .max(5, 'Maximum rating is 5'),
  comment: z.string().trim().max(1000, 'Comment too long').optional(),
})

// ─── Update Review ────────────────────────────────────────────────────────────

export const updateReviewSchema = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().trim().max(1000).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'At least one field is required' })

// ─── Params ───────────────────────────────────────────────────────────────────

export const reviewIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Review ID is required'),
})

export const mentorIdParamSchema = z.object({
  mentorId: z.string().trim().min(1, 'Mentor ID is required'),
})

export const sessionIdParamSchema = z.object({
  sessionId: z.string().trim().min(1, 'Session ID is required'),
})
