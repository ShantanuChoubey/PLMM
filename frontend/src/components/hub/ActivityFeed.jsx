import { formatDistanceToNow } from 'date-fns'
import { Calendar, FileText, MessageSquare, UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const typeConfig = {
  joined: { icon: UserPlus, label: 'Joined Group' },
  resource: { icon: FileText, label: 'Uploaded Resource' },
  session: { icon: Calendar, label: 'Created Session' },
  update: { icon: MessageSquare, label: 'Posted Update' },
}

export function ActivityFeed({ activities, title = 'Recent Activity', className }) {
  return (
    <Card className={cn('border-border/70 bg-card/60', className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((item) => {
              const config = typeConfig[item.type] ?? typeConfig.update
              const Icon = config.icon
              return (
                <li key={item.id} className="flex gap-3 border-b border-border/60 pb-4 last:border-0 last:pb-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{item.user}</span>{' '}
                      <span className="text-muted-foreground">{item.message}</span>
                    </p>
                    <time className="text-xs text-muted-foreground" dateTime={item.timestamp}>
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </time>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
