import { z } from 'zod'

const GROUP_CATEGORIES = [
  'Frontend Development',
  'Backend Development',
  'DSA',
  'Java',
  'Python',
  'DBMS',
  'System Design',
  'Interview Preparation',
  'Machine Learning',
  'Cloud Computing',
  'DevOps',
  'Mobile Development',
  'Other',
]

// ─── Create Group ─────────────────────────────────────────────────────────────

export const createGroupSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters').max(100, 'Name too long'),
  description: z.string().trim().max(1000, 'Description too long').optional(),
  category: z.string().trim().min(1, 'Category is required').max(100, 'Category too long'),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
  maxMembers: z
    .number({ invalid_type_error: 'maxMembers must be a number' })
    .int()
    .min(2, 'Minimum 2 members')
    .max(500, 'Maximum 500 members')
    .default(50),
})

// ─── Update Group ─────────────────────────────────────────────────────────────

export const updateGroupSchema = z
  .object({
    name: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().max(1000).optional(),
    category: z.string().trim().min(1).max(100).optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
    maxMembers: z.number().int().min(2).max(500).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'At least one field is required' })

// ─── Group ID param ───────────────────────────────────────────────────────────

export const groupIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Group ID is required'),
})

// ─── Query filters ────────────────────────────────────────────────────────────

export const groupQuerySchema = z
  .object({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
    sortBy: z.enum(['createdAt', 'name', 'members']).default('createdAt'),
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

export { GROUP_CATEGORIES }
