import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Calendar, Star, Users } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LEARNER_ROUTES } from '@/constants/routes'
import { getMentorById } from '@/mock/mentorData'

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
}

const slotStatusStyles = {
  available: 'text-emerald-600 dark:text-emerald-400',
  limited: 'text-amber-600 dark:text-amber-400',
  booked: 'text-muted-foreground',
}

export default function LearnerMentorDetailsPage() {
  const { id } = useParams()
  const mentor = getMentorById(id)

  if (!mentor) {
    return (
      <PageContainer title="Mentor Not Found" description="This mentor profile could not be found.">
        <Button asChild variant="outline">
          <Link to={LEARNER_ROUTES.MENTORS}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Mentors
          </Link>
        </Button>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={mentor.name}
      description={mentor.department}
      actions={
        <Button type="button" onClick={() => toast.success('Session booking flow coming soon (mock).')}>
          <Calendar className="h-4 w-4" aria-hidden="true" />
          Book Session
        </Button>
      }
    >
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to={LEARNER_ROUTES.MENTORS}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Mentors
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/70">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                {getInitials(mentor.name)}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-semibold">{mentor.name}</h2>
                  <Badge variant="secondary" className="capitalize">{mentor.availability}</Badge>
                </div>
                <p className="text-muted-foreground">{mentor.department} · {mentor.experience}</p>
                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  <span className="font-medium">{mentor.rating}</span>
                  <span className="text-sm text-muted-foreground">({mentor.reviewCount} reviews)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader><CardTitle>Bio</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{mentor.bio}</p></CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {mentor.skills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader><CardTitle>Reviews</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {mentor.reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              ) : (
                mentor.reviews.map((review) => (
                  <div key={review.id} className="rounded-lg border border-border/60 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.author}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                        {review.rating}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/70">
            <CardHeader><CardTitle>Statistics</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sessions</span><span className="font-medium">{mentor.stats.sessions}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mentees</span><span className="font-medium">{mentor.stats.mentees}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Response Rate</span><span className="font-medium">{mentor.stats.responseRate}</span></div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mentor.slots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No slots available.</p>
              ) : (
                <ul className="space-y-3">
                  {mentor.slots.map((slot) => (
                    <li key={`${slot.day}-${slot.time}`} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
                      <div>
                        <p className="font-medium">{slot.day}</p>
                        <p className="text-muted-foreground">{slot.time}</p>
                      </div>
                      <span className={`text-xs font-medium capitalize ${slotStatusStyles[slot.status] ?? ''}`}>
                        {slot.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Button
            type="button"
            className="w-full"
            onClick={() => toast.success('Session booking flow coming soon (mock).')}
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            Book Session
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}
