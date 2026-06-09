import toast from 'react-hot-toast'
import { Calendar, Clock } from 'lucide-react'
import { SessionStatusBadge } from '@/components/shared/SessionStatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function MentorSessionRequestCard({ session, onStatusChange, className }) {
  const isPending = session.status === 'pending'
  const isAccepted = session.status === 'accepted'

  return (
    <Card className={cn('border-border/70 bg-card/60', className)}>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{session.topic}</CardTitle>
          <SessionStatusBadge status={session.status} />
        </div>
        <p className="text-sm text-muted-foreground">Requested by {session.learnerName}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><Calendar className="h-4 w-4" aria-hidden="true" />{session.requestedDate}</div>
        <div className="flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden="true" />{session.requestedTime}</div>
        <p>{session.meetingType}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => toast('Session details (mock).')}>View Details</Button>
        {isPending ? (
          <>
            <Button type="button" size="sm" onClick={() => { onStatusChange?.(session.id, 'accepted'); toast.success('Session accepted (mock).') }}>Accept</Button>
            <Button type="button" variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => { onStatusChange?.(session.id, 'cancelled'); toast.success('Session rejected (mock).') }}>Reject</Button>
          </>
        ) : null}
        {isAccepted ? (
          <>
            <Button type="button" variant="outline" size="sm" onClick={() => toast('Reschedule flow (mock).')}>Reschedule</Button>
            <Button type="button" size="sm" onClick={() => { onStatusChange?.(session.id, 'completed'); toast.success('Session marked complete (mock).') }}>Complete</Button>
          </>
        ) : null}
      </CardFooter>
    </Card>
  )
}
