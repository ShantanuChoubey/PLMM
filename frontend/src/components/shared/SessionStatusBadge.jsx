import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusStyles = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  accepted: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  scheduled: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  in_progress: 'bg-primary/10 text-primary',
}

export function SessionStatusBadge({ status, className }) {
  return (
    <Badge variant="secondary" className={cn('capitalize shrink-0', statusStyles[status], className)}>
      {status.replace('_', ' ')}
    </Badge>
  )
}
