import { Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ReviewCard({ review, className }) {
  return (
    <Card className={cn('border-border/70 bg-card/60', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">{review.author}</CardTitle>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
          {review.rating}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
        {review.date ? <p className="mt-2 text-xs text-muted-foreground">{review.date}</p> : null}
      </CardContent>
    </Card>
  )
}
