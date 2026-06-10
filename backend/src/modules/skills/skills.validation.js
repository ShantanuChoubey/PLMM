import { z } from 'zod'

export const createSkillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(100),
  description: z.string().trim().max(500).optional().nullable(),
})

export const updateSkillSchema = createSkillSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required' },
)

export const assignSkillSchema = z.object({
  skillId: z.string().trim().min(1, 'Skill ID is required'),
})

export const skillIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Skill ID is required'),
})

export const mentorSkillIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Assignment ID is required'),
})
