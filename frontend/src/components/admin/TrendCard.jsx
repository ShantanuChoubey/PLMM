import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function TrendCard({ title, value, trend, trendLabel, className }) {
  const isUp = trend?.startsWith('+') || (typeof trend === 'number' && trend > 0)

  return (
    <Card className={cn('border-border/70 bg-card/60', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-semibold">{value}</p>
          <span className={cn('flex items-center gap-1 text-sm font-medium', isUp ? 'text-emerald-500' : 'text-rose-500')}>
            {isUp ? <TrendingUp className="h-4 w-4" aria-hidden="true" /> : <TrendingDown className="h-4 w-4" aria-hidden="true" />}
            {trend}
          </span>
        </div>
        {trendLabel ? <p className="mt-2 text-xs text-muted-foreground">{trendLabel}</p> : null}
      </CardContent>
    </Card>
  )
}
