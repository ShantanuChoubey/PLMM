import { z } from 'zod'

const AUDIT_ACTIONS = [
  'CREATE', 'UPDATE', 'DELETE',
  'LOGIN', 'LOGOUT', 'REGISTER',
  'BOOK_SESSION', 'COMPLETE_SESSION',
  'JOIN_GROUP', 'UPLOAD_RESOURCE', 'SUBMIT_REVIEW',
]

const AUDIT_ENTITY_TYPES = [
  'USER', 'PROFILE', 'SKILL', 'MENTOR',
  'SESSION', 'GROUP', 'RESOURCE',
  'REVIEW', 'NOTIFICATION', 'SYSTEM',
]

// ─── Params ───────────────────────────────────────────────────────────────────

export const auditIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Audit log ID is required'),
})

// ─── Query filters ────────────────────────────────────────────────────────────

export const auditQuerySchema = z
  .object({
    action: z
      .enum(AUDIT_ACTIONS, {
        errorMap: () => ({ message: `Action must be one of: ${AUDIT_ACTIONS.join(', ')}` }),
      })
      .optional(),
    entityType: z
      .enum(AUDIT_ENTITY_TYPES, {
        errorMap: () => ({ message: `entityType must be one of: ${AUDIT_ENTITY_TYPES.join(', ')}` }),
      })
      .optional(),
    userId: z.string().trim().optional(),
    dateFrom: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateFrom must be YYYY-MM-DD')
      .optional(),
    dateTo: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateTo must be YYYY-MM-DD')
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
  .refine(
    (d) => {
      if (d.dateFrom && d.dateTo) {
        return new Date(d.dateFrom) <= new Date(d.dateTo)
      }
      return true
    },
    { message: 'dateFrom must be before or equal to dateTo', path: ['dateFrom'] },
  )

export { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES }
