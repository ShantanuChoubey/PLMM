import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ChartCard({ title, description, children, className, contentClassName }) {
  return (
    <Card className={cn('border-border/70 bg-card/60', className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </CardHeader>
      <CardContent className={cn('h-64', contentClassName)}>{children}</CardContent>
    </Card>
  )
}
