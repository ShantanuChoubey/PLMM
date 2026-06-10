import { z } from 'zod'
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  SORT_FIELDS,
  SORT_ORDERS,
} from '../../constants/discovery.js'

const dayValues = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const searchMentorsQuerySchema = z.object({
  skill: z.string().trim().optional(),
  department: z.string().trim().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  availability: z.enum(dayValues).optional(),
  experience: z.string().trim().optional(),
  specialization: z.string().trim().optional(),
  sortBy: z.enum(SORT_FIELDS).optional().default('rating'),
  sortOrder: z.enum(SORT_ORDERS).optional().default('desc'),
  page: z.coerce.number().int().min(1).optional().default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).optional().default(DEFAULT_LIMIT),
})

export const mentorIdParamSchema = z.object({
  mentorId: z.string().trim().min(1, 'Mentor ID is required'),
})
