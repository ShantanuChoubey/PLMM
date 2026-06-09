import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function MetricCard({ title, value, icon: Icon, trend, description, className }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className={cn('h-full', className)}>
      <Card className="h-full border-border/70 bg-card/60 transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {Icon ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background">
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </span>
          ) : null}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight">{value}</div>
          {trend ? <p className="mt-1 text-xs font-medium text-emerald-500">{trend}</p> : null}
          {description ? <p className="mt-2 text-xs text-muted-foreground">{description}</p> : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}
