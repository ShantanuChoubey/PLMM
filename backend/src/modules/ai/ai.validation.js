import { z } from 'zod'

const MAX_PROMPT_LENGTH = 2000

export const testPromptSchema = z.object({
  prompt: z
    .string({ required_error: 'Prompt is required' })
    .trim()
    .min(1, 'Prompt cannot be empty')
    .max(MAX_PROMPT_LENGTH, `Prompt must not exceed ${MAX_PROMPT_LENGTH} characters`),
})

export { MAX_PROMPT_LENGTH }
