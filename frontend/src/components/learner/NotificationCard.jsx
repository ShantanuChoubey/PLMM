import { formatDistanceToNow } from 'date-fns'
import { Bell, Calendar, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const typeIcons = {
  session: Calendar,
  recommendation: Sparkles,
  group: Users,
  progress: TrendingUp,
  default: Bell,
}

export function NotificationCard({ notification, className, onClick }) {
  const Icon = typeIcons[notification.type] ?? typeIcons.default

  return (
    <Card
      className={cn(
        'cursor-pointer border-border/70 transition-colors hover:bg-accent/30',
        !notification.read && 'border-primary/20 bg-primary/5',
        className,
      )}
      onClick={onClick}
      role="article"
      aria-label={`${notification.title}${notification.read ? '' : ', unread'}`}
    >
      <CardContent className="flex gap-4 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-medium leading-snug">{notification.title}</h3>
            {!notification.read ? (
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] capitalize">
              {notification.type}
            </Badge>
            <time className="text-xs text-muted-foreground" dateTime={notification.timestamp}>
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </time>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
