import { Award, Flame, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const iconMap = {
  session: Award,
  streak: Flame,
  skill: Target,
}

export function AchievementCard({ achievement, className }) {
  const Icon = iconMap[achievement.icon] ?? Award

  return (
    <Card className={cn('border-border/70 bg-card/60', className)}>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
          <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </span>
        <div>
          <CardTitle className="text-base">{achievement.title}</CardTitle>
          <p className="text-xs text-muted-foreground">Earned {achievement.earnedAt}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
      </CardContent>
    </Card>
  )
}
