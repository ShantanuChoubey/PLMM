import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PLATFORM_HEATMAP } from '@/mock/analyticsData'
import { cn } from '@/lib/utils'

const hourLabels = ['12a', '2a', '4a', '6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p']

function getIntensity(value) {
  if (value >= 35) return 'bg-primary'
  if (value >= 25) return 'bg-primary/70'
  if (value >= 15) return 'bg-primary/40'
  if (value >= 8) return 'bg-primary/20'
  return 'bg-primary/10'
}

export function PlatformHeatmap({ className }) {
  return (
    <Card className={cn('border-border/70 bg-card/60', className)}>
      <CardHeader>
        <CardTitle className="text-base">Platform Activity Heatmap</CardTitle>
        <p className="text-sm text-muted-foreground">User activity by day and time (mock)</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[480px]">
          <div className="mb-2 grid grid-cols-[40px_repeat(12,1fr)] gap-1">
            <span />
            {hourLabels.map((h) => (
              <span key={h} className="text-center text-[10px] text-muted-foreground">{h}</span>
            ))}
          </div>
          {PLATFORM_HEATMAP.map((row) => (
            <div key={row.day} className="mb-1 grid grid-cols-[40px_repeat(12,1fr)] gap-1">
              <span className="text-xs text-muted-foreground">{row.day}</span>
              {row.hours.map((value, i) => (
                <span
                  key={`${row.day}-${i}`}
                  className={cn('aspect-square rounded-sm', getIntensity(value))}
                  title={`${row.day} ${hourLabels[i]}: ${value} active users`}
                  aria-label={`${row.day} ${hourLabels[i]}: ${value} active users`}
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
