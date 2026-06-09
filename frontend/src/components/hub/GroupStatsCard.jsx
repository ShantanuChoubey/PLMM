import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function GroupStatsCard({ stats, className }) {
  const items = [
    { label: 'Total Members', value: stats.memberCount ?? stats.totalMembers },
    { label: 'Resources Shared', value: stats.resourcesShared },
    { label: 'Sessions Conducted', value: stats.sessionsConducted },
    { label: 'Weekly Activity', value: `${stats.weeklyActivity}%` },
  ]

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {items.map((item) => (
        <Card key={item.label} className="border-border/70 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
