import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusStyles = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  operational: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  published: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  inactive: 'bg-muted text-muted-foreground',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  suspended: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  flagged: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  degraded: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  rejected: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  completed: 'bg-muted text-muted-foreground',
  accepted: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
}

export function StatusBadge({ status, className }) {
  return (
    <Badge variant="secondary" className={cn('capitalize shrink-0', statusStyles[status], className)}>
      {status}
    </Badge>
  )
}
