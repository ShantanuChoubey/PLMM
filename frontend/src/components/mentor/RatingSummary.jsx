import { Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkillProgressBar } from '@/components/learner/SkillProgressBar'

export function RatingSummary({ summary }) {
  return (
    <Card className="border-border/70 bg-card/60">
      <CardHeader>
        <CardTitle className="text-lg">Rating Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-semibold tracking-tight">{summary.averageRating}</span>
          <div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(summary.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} aria-hidden="true" />
              ))}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{summary.totalReviews} total reviews</p>
          </div>
        </div>
        <div className="space-y-3">
          {summary.ratingBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="w-12 text-sm text-muted-foreground">{item.stars} star</span>
              <div className="flex-1">
                <SkillProgressBar skill="" progress={item.percentage} className="[&>div:first-child]:hidden" />
              </div>
              <span className="w-8 text-right text-sm text-muted-foreground">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
