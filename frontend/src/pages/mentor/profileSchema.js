import { z } from 'zod'

export const mentorProfileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  skills: z.string().min(2, 'List at least one skill'),
  experience: z.string().min(2, 'Experience is required'),
  education: z.string().min(2, 'Education is required'),
  availabilitySummary: z.string().min(5, 'Availability summary is required'),
})
