import { Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function AvailabilityCard({ slot, className }) {
  return (
    <Card className={cn('border-border/70 bg-card/60', className)}>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium">{slot.day}</p>
          <p className="text-sm text-muted-foreground">{slot.label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
