import { BookOpen, Calendar, Clock, Star, Users } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { QuickActionCard } from '@/components/ui/QuickActionCard'
import { StatCard } from '@/components/ui/StatCard'
import { MENTOR_ROUTES } from '@/constants/routes'

export default function MentorDashboard() {
  return (
    <PageContainer
      title="Mentor Dashboard"
      description="Manage availability, sessions, and learner feedback."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Mentees"
          value="8"
          icon={Users}
          trend="+2 this month"
          description="Learners you are currently mentoring"
        />
        <StatCard
          title="Sessions This Week"
          value="5"
          icon={Calendar}
          trend="2 upcoming"
          description="Completed and scheduled sessions"
        />
        <StatCard
          title="Availability"
          value="12h"
          icon={Clock}
          description="Open mentoring hours this week"
        />
        <StatCard
          title="Average Rating"
          value="4.8"
          icon={Star}
          trend="+0.2"
          description="Based on recent learner reviews"
        />
      </div>

      <section className="mt-8" aria-labelledby="mentor-quick-actions">
        <h2 id="mentor-quick-actions" className="mb-4 text-lg font-semibold tracking-tight">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Update Availability"
            description="Set your mentoring schedule and open slots."
            icon={Clock}
            to={MENTOR_ROUTES.AVAILABILITY}
          />
          <QuickActionCard
            title="View Sessions"
            description="Review upcoming and past mentoring sessions."
            icon={Calendar}
            to={MENTOR_ROUTES.SESSIONS}
          />
          <QuickActionCard
            title="Share Resource"
            description="Upload materials for your mentees."
            icon={BookOpen}
            to={MENTOR_ROUTES.RESOURCES}
          />
        </div>
      </section>
    </PageContainer>
  )
}
