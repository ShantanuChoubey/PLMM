import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WEEK_DAYS } from '@/mock/availabilityData'

const slotSchema = z.object({
  day: z.string().min(1, 'Select a day'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
})

export function AvailabilityForm({ defaultValues, onSubmit, onCancel, submitLabel = 'Save Slot' }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(slotSchema),
    defaultValues: defaultValues ?? { day: 'Monday', startTime: '18:00', endTime: '19:00' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="day" className="text-sm font-medium">Day</label>
        <select id="day" {...register('day')} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Day">
          {WEEK_DAYS.map((day) => <option key={day} value={day}>{day}</option>)}
        </select>
        {errors.day ? <p className="text-sm text-destructive" role="alert">{errors.day.message}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="startTime" className="text-sm font-medium">Start Time</label>
          <Input id="startTime" type="time" {...register('startTime')} />
          {errors.startTime ? <p className="text-sm text-destructive" role="alert">{errors.startTime.message}</p> : null}
        </div>
        <div className="space-y-2">
          <label htmlFor="endTime" className="text-sm font-medium">End Time</label>
          <Input id="endTime" type="time" {...register('endTime')} />
          {errors.endTime ? <p className="text-sm text-destructive" role="alert">{errors.endTime.message}</p> : null}
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>{submitLabel}</Button>
        {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> : null}
      </div>
    </form>
  )
}
