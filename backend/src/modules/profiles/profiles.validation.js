import { z } from 'zod'

const optionalText = z.string().trim().optional().nullable()

export const createLearnerProfileSchema = z.object({
  department: optionalText,
  year: optionalText,
  bio: optionalText,
  goals: optionalText,
  availability: optionalText,
})

export const updateLearnerProfileSchema = createLearnerProfileSchema.partial()

export const createMentorProfileSchema = z.object({
  bio: optionalText,
  experience: optionalText,
  specialization: optionalText,
  availability: optionalText,
})

export const updateMentorProfileSchema = createMentorProfileSchema.partial()

export const createFacultyProfileSchema = z.object({
  designation: optionalText,
  department: optionalText,
  expertise: optionalText,
  bio: optionalText,
})

export const updateFacultyProfileSchema = createFacultyProfileSchema.partial()
