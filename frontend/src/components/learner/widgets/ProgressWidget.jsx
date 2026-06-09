import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkillProgressBar } from '@/components/learner/SkillProgressBar'
import { LEARNER_ROUTES } from '@/constants/routes'
import { DASHBOARD_METRICS } from '@/mock/learnerData'
import { SKILLS_PROGRESS } from '@/mock/progressData'

export function ProgressWidget() {
  const topSkills = SKILLS_PROGRESS.slice(0, 3)

  return (
    <Card className="border-border/70 bg-card/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">Learning Progress</CardTitle>
          <p className="text-sm text-muted-foreground">
            Overall {DASHBOARD_METRICS.learningProgress}% complete
          </p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to={LEARNER_ROUTES.PROGRESS}>Details</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {topSkills.map((item) => (
          <SkillProgressBar key={item.skill} skill={item.skill} progress={item.progress} />
        ))}
      </CardContent>
    </Card>
  )
}
