import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LEARNER_ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export function DashboardWelcomeCard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? 'Learner'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-card via-card to-primary/5">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Welcome back</p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Hi {firstName}, ready to learn?
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              You have upcoming sessions and new mentor recommendations waiting for you.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link to={LEARNER_ROUTES.SESSIONS}>
                View Sessions
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={LEARNER_ROUTES.RECOMMENDATIONS}>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Recommendations
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
