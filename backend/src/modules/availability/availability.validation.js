import { z } from 'zod'
import { isValidTimeFormat, isValidTimeRange } from '../../utils/time.js'

const dayValues = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const daySchema = z.enum(dayValues, {
  errorMap: () => ({ message: `Day must be one of: ${dayValues.join(', ')}` }),
})

const timeSchema = z
  .string()
  .trim()
  .refine(isValidTimeFormat, { message: 'Time must be in HH:mm format (24-hour)' })

const slotFieldsSchema = z
  .object({
    day: daySchema,
    startTime: timeSchema,
    endTime: timeSchema,
  })
  .refine((data) => isValidTimeRange(data.startTime, data.endTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
  })

export const createSlotSchema = slotFieldsSchema

export const updateSlotSchema = z
  .object({
    day: daySchema.optional(),
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    isBooked: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime && !isValidTimeRange(data.startTime, data.endTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time must be after start time',
        path: ['endTime'],
      })
    }
  })

export const slotIdParamSchema = z.object({
  slotId: z.string().trim().min(1, 'Slot ID is required'),
})

export const mentorIdParamSchema = z.object({
  mentorId: z.string().trim().min(1, 'Mentor ID is required'),
})
