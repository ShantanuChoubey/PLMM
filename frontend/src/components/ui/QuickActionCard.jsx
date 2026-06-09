import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  to,
  onClick,
  className,
}) {
  const content = (
    <Card
      className={cn(
        'h-full cursor-pointer border-border/70 bg-card/60 transition-colors hover:border-border hover:bg-accent/30',
        className,
      )}
    >
      <CardHeader className="space-y-3">
        {Icon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
            <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </span>
        ) : null}
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
        </div>
      </CardHeader>
      <CardContent />
    </Card>
  )

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="h-full">
      {to ? (
        <Link to={to} className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="block h-full w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {content}
        </button>
      )}
    </motion.div>
  )
}
