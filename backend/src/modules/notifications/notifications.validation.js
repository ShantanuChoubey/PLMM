import { z } from 'zod'

const NOTIFICATION_TYPES = [
  'SESSION_BOOKED',
  'SESSION_ACCEPTED',
  'SESSION_REJECTED',
  'SESSION_CANCELLED',
  'SESSION_COMPLETED',
  'GROUP_JOINED',
  'GROUP_CREATED',
  'RESOURCE_UPLOADED',
  'REVIEW_RECEIVED',
  'SYSTEM',
]

// ─── Params ───────────────────────────────────────────────────────────────────

export const notifIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Notification ID is required'),
})

// ─── Query ────────────────────────────────────────────────────────────────────

export const notifQuerySchema = z
  .object({
    isRead: z
      .string()
      .optional()
      .transform((v) => {
        if (v === 'true')  return true
        if (v === 'false') return false
        return undefined
      }),
    type: z
      .enum(NOTIFICATION_TYPES, {
        errorMap: () => ({ message: `Type must be one of: ${NOTIFICATION_TYPES.join(', ')}` }),
      })
      .optional(),
    sortBy: z.enum(['createdAt']).default('createdAt'),
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

export { NOTIFICATION_TYPES }
