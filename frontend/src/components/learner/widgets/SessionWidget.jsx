import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LEARNER_ROUTES } from '@/constants/routes'
import { LEARNER_SESSIONS } from '@/mock/sessionData'

export function SessionWidget() {
  const upcoming = LEARNER_SESSIONS.filter((s) => s.status === 'upcoming').slice(0, 3)

  return (
    <Card className="border-border/70 bg-card/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to={LEARNER_ROUTES.SESSIONS}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming sessions.</p>
        ) : (
          upcoming.map((session) => (
            <div
              key={session.id}
              className="flex items-start gap-3 rounded-lg border border-border/60 p-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">{session.topic}</p>
                <p className="text-xs text-muted-foreground">
                  {session.mentorName} · {format(new Date(session.date), 'MMM d')} at {session.time}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
