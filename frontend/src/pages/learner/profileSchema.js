import { z } from 'zod'

export const learnerProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  university: z.string().min(2, 'University is required'),
  department: z.string().min(2, 'Department is required'),
  year: z.string().min(1, 'Year is required'),
  gpa: z.string().optional(),
  learningGoals: z.string().min(5, 'Add at least one learning goal'),
  skillsNeeded: z.string().min(2, 'List skills you want to develop'),
  availabilityDays: z.string().min(2, 'Availability days are required'),
  availabilityTime: z.string().min(2, 'Availability time is required'),
  timezone: z.string().min(2, 'Timezone is required'),
})
