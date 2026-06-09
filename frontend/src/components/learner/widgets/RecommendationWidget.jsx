import { Link } from 'react-router-dom'
import { RecommendationCard } from '@/components/learner/RecommendationCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LEARNER_ROUTES } from '@/constants/routes'
import { LEARNER_RECOMMENDATIONS } from '@/mock/recommendationData'

export function RecommendationWidget() {
  const preview = LEARNER_RECOMMENDATIONS.slice(0, 2)

  return (
    <Card className="border-border/70 bg-card/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">AI Recommendations</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to={LEARNER_ROUTES.RECOMMENDATIONS}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {preview.map((item) => (
          <RecommendationCard key={item.id} recommendation={item} />
        ))}
      </CardContent>
    </Card>
  )
}
