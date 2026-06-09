import toast from 'react-hot-toast'
import { Calendar, Clock, Video } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const statusStyles = {
  upcoming: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  completed: 'bg-muted text-muted-foreground',
  cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
}

export function SessionCard({ session, className }) {
  const isActive = session.status === 'upcoming' || session.status === 'pending'

  return (
    <Card className={cn('border-border/70 bg-card/60', className)}>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{session.topic}</CardTitle>
          <Badge
            variant="secondary"
            className={cn('capitalize shrink-0', statusStyles[session.status])}
          >
            {session.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">with {session.mentorName}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          {session.date}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {session.time}
        </div>
        <div className="flex items-center gap-2">
          <Video className="h-4 w-4" aria-hidden="true" />
          {session.meetingType}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => toast('Session details coming in a future sprint.')}
        >
          View Details
        </Button>
        {isActive ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast('Reschedule flow coming soon.')}
            >
              Reschedule
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => toast('Session cancellation requested (mock).')}
            >
              Cancel Session
            </Button>
            {session.status === 'upcoming' ? (
              <Button
                type="button"
                size="sm"
                onClick={() => toast('Joining session (mock).')}
              >
                Join Session
              </Button>
            ) : null}
          </>
        ) : null}
      </CardFooter>
    </Card>
  )
}
