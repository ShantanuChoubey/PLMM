import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { LEARNER_ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'

const availabilityStyles = {
  available: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  busy: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  offline: 'bg-muted text-muted-foreground',
  limited: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function MentorCard({ mentor, className }) {
  const profileUrl = LEARNER_ROUTES.MENTORS.replace(/\/$/, '') + `/${mentor.id}`

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className={className}>
      <Card className="flex h-full flex-col border-border/70 bg-card/60 transition-shadow hover:shadow-md">
        <CardHeader className="space-y-4">
          <div className="flex items-start gap-3">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              aria-hidden="true"
            >
              {getInitials(mentor.name)}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold tracking-tight">{mentor.name}</h3>
              <p className="text-sm text-muted-foreground">{mentor.department}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                <span className="font-medium">{mentor.rating}</span>
                <span className="text-muted-foreground">({mentor.reviewCount})</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mentor.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-2 text-sm text-muted-foreground">
          <p>Experience: <span className="text-foreground">{mentor.experience}</span></p>
          <p>
            Availability:{' '}
            <span
              className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                availabilityStyles[mentor.availability] ?? availabilityStyles.offline,
              )}
            >
              {mentor.availability}
            </span>
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={profileUrl}>View Profile</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link to={profileUrl}>Book Session</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
