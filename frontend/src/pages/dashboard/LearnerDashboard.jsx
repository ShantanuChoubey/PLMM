import {
  BookOpen,
  Calendar,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { QuickActionCard } from '@/components/ui/QuickActionCard'
import { StatCard } from '@/components/ui/StatCard'
import { LEARNER_ROUTES } from '@/constants/routes'

export default function LearnerDashboard() {
  return (
    <PageContainer
      title="Learner Dashboard"
      description="Track your mentorship journey, sessions, and learning progress."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Mentors"
          value="3"
          icon={Users}
          trend="+1 this month"
          description="Mentors currently supporting your goals"
        />
        <StatCard
          title="Upcoming Sessions"
          value="2"
          icon={Calendar}
          trend="Next in 2 days"
          description="Scheduled learning sessions"
        />
        <StatCard
          title="Resources"
          value="12"
          icon={BookOpen}
          trend="+4 new"
          description="Shared learning materials"
        />
        <StatCard
          title="Progress Score"
          value="78%"
          icon={TrendingUp}
          trend="+6%"
          description="Overall learning momentum"
        />
      </div>

      <section className="mt-8" aria-labelledby="learner-quick-actions">
        <h2 id="learner-quick-actions" className="mb-4 text-lg font-semibold tracking-tight">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Find Mentor"
            description="Discover mentors aligned with your learning goals."
            icon={Users}
            to={LEARNER_ROUTES.MENTORS}
          />
          <QuickActionCard
            title="Book Session"
            description="Schedule your next mentorship session."
            icon={Calendar}
            to={LEARNER_ROUTES.SESSIONS}
          />
          <QuickActionCard
            title="View Recommendations"
            description="Explore personalized mentor recommendations."
            icon={Sparkles}
            to={LEARNER_ROUTES.RECOMMENDATIONS}
          />
        </div>
      </section>
    </PageContainer>
  )
}
