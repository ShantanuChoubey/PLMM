import { z } from 'zod'
import { REGISTERABLE_ROLES, ROLES } from '../../constants/roles.js'

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(REGISTERABLE_ROLES).optional().default(ROLES.LEARNER),
})

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})
