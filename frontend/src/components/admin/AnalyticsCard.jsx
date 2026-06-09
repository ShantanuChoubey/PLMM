import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function AnalyticsCard({ title, value, subtitle, change, className }) {
  const isPositive = change?.startsWith('+')

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={cn('h-full', className)}>
      <Card className="h-full border-border/70 bg-card/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
          {change ? (
            <p className={cn('mt-2 text-xs font-medium', isPositive ? 'text-emerald-500' : 'text-rose-500')}>
              {change} vs last month
            </p>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}
