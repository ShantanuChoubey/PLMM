import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LEARNER_ROUTES } from '@/constants/routes'

export function RecommendationCard({ recommendation, className }) {
  const mentorUrl = `${LEARNER_ROUTES.MENTORS}/${recommendation.mentorId}`

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className={className}>
      <Card className="h-full border-border/70 bg-card/60 transition-shadow hover:shadow-md">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">{recommendation.mentorName}</CardTitle>
              <p className="text-sm text-muted-foreground">{recommendation.department}</p>
            </div>
            <Badge className="shrink-0 gap-1 bg-primary/10 text-primary hover:bg-primary/10">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {recommendation.matchScore}%
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            {recommendation.rating}
            <span className="capitalize">· {recommendation.availability}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
          <div className="flex flex-wrap gap-1.5">
            {recommendation.skillsMatched.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link to={mentorUrl}>Book Session</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
