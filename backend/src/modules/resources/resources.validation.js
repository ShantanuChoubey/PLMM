import { z } from 'zod'

const RESOURCE_TYPES = ['PDF', 'VIDEO', 'ARTICLE', 'LINK', 'DOCUMENT', 'PRESENTATION']

// ─── Create Resource ──────────────────────────────────────────────────────────

export const createResourceSchema = z
  .object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
    description: z.string().trim().max(1000).optional(),
    type: z.enum(RESOURCE_TYPES, {
      errorMap: () => ({ message: `Type must be one of: ${RESOURCE_TYPES.join(', ')}` }),
    }),
    category: z.string().trim().min(1, 'Category is required').max(100),
    externalUrl: z.string().trim().url('Must be a valid URL').optional(),
    groupId: z.string().trim().optional(),
  })
  .refine(
    (d) => d.externalUrl || true, // file OR url — file is validated at middleware level
    { message: 'Either a file or an external URL is required' },
  )

// ─── Update Resource ──────────────────────────────────────────────────────────

export const updateResourceSchema = z
  .object({
    title: z.string().trim().min(3).max(200).optional(),
    description: z.string().trim().max(1000).optional(),
    category: z.string().trim().min(1).max(100).optional(),
    externalUrl: z.string().trim().url().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'At least one field is required' })

// ─── Resource ID param ────────────────────────────────────────────────────────

export const resourceIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Resource ID is required'),
})

// ─── Query filters ────────────────────────────────────────────────────────────

export const resourceQuerySchema = z
  .object({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    type: z.enum(RESOURCE_TYPES).optional(),
    uploadedBy: z.string().trim().optional(),
    groupId: z.string().trim().optional(),
    sortBy: z.enum(['createdAt', 'views', 'downloads', 'title']).default('createdAt'),
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

export { RESOURCE_TYPES }
