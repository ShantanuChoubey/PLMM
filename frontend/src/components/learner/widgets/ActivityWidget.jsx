import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RECENT_ACTIVITY } from '@/mock/learnerData'

export function ActivityWidget() {
  return (
    <Card className="border-border/70 bg-card/60">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {RECENT_ACTIVITY.map((activity) => (
            <li key={activity.id} className="border-b border-border/60 pb-4 last:border-0 last:pb-0">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
              <time className="mt-1 block text-xs text-muted-foreground" dateTime={activity.timestamp}>
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </time>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
