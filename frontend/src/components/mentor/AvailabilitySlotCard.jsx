import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function AvailabilitySlotCard({ slot, onEdit, onDelete, className }) {
  return (
    <Card className={cn('border-border/70 bg-card/60', className)}>
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div>
          <p className="text-sm font-medium">{slot.day}</p>
          <p className="text-sm text-muted-foreground">{slot.label}</p>
        </div>
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(slot)} aria-label={`Edit ${slot.day} slot`}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => onDelete(slot.id)} aria-label={`Delete ${slot.day} slot`} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
