import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LEARNER_ROUTES } from '@/constants/routes'
import { LEARNER_NOTIFICATIONS } from '@/mock/notificationData'

export function NotificationWidget() {
  const preview = LEARNER_NOTIFICATIONS.filter((n) => !n.read).slice(0, 3)

  return (
    <Card className="border-border/70 bg-card/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Notifications</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to={LEARNER_ROUTES.NOTIFICATIONS}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {preview.length === 0 ? (
          <p className="text-sm text-muted-foreground">You&apos;re all caught up.</p>
        ) : (
          preview.map((notification) => (
            <div
              key={notification.id}
              className="rounded-lg border border-border/60 bg-primary/5 p-3"
            >
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>
              <time className="mt-1 block text-[11px] text-muted-foreground" dateTime={notification.timestamp}>
                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
              </time>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
