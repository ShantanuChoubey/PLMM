import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WEEK_DAYS } from '@/mock/availabilityData'
import { cn } from '@/lib/utils'

function formatTimeLabel(time) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export function AvailabilityCalendar({ slots, className }) {
  const slotsByDay = WEEK_DAYS.reduce((acc, day) => {
    acc[day] = slots.filter((s) => s.day === day)
    return acc
  }, {})

  return (
    <Card className={cn('border-border/70', className)}>
      <CardHeader><CardTitle className="text-lg">Weekly Calendar</CardTitle></CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="rounded-lg border border-border/60 p-3 min-h-[5rem]">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{day.slice(0, 3)}</p>
              {slotsByDay[day].length === 0 ? (
                <p className="text-xs text-muted-foreground">—</p>
              ) : (
                <ul className="space-y-1">
                  {slotsByDay[day].map((slot) => (
                    <li key={slot.id} className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {slot.label ?? `${formatTimeLabel(slot.startTime)} - ${formatTimeLabel(slot.endTime)}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
