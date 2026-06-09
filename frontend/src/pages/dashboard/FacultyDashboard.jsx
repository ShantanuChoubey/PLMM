import { BookOpen, Calendar, Star, Users } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { QuickActionCard } from '@/components/ui/QuickActionCard'
import { StatCard } from '@/components/ui/StatCard'
import { FACULTY_ROUTES } from '@/constants/routes'

export default function FacultyDashboard() {
  return (
    <PageContainer
      title="Faculty Dashboard"
      description="Oversee mentees, sessions, and academic mentorship activity."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Assigned Mentees"
          value="14"
          icon={Users}
          trend="+3 this term"
          description="Learners under faculty mentorship"
        />
        <StatCard
          title="Sessions"
          value="9"
          icon={Calendar}
          trend="3 this week"
          description="Faculty-led mentoring sessions"
        />
        <StatCard
          title="Resources"
          value="21"
          icon={BookOpen}
          description="Academic resources shared"
        />
        <StatCard
          title="Feedback Score"
          value="4.9"
          icon={Star}
          trend="+0.1"
          description="Mentee satisfaction rating"
        />
      </div>

      <section className="mt-8" aria-labelledby="faculty-quick-actions">
        <h2 id="faculty-quick-actions" className="mb-4 text-lg font-semibold tracking-tight">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="View Mentees"
            description="Review assigned learners and their progress."
            icon={Users}
            to={FACULTY_ROUTES.MENTEES}
          />
          <QuickActionCard
            title="Manage Sessions"
            description="Plan and track faculty mentoring sessions."
            icon={Calendar}
            to={FACULTY_ROUTES.SESSIONS}
          />
          <QuickActionCard
            title="Share Resource"
            description="Publish academic materials for mentees."
            icon={BookOpen}
            to={FACULTY_ROUTES.RESOURCES}
          />
        </div>
      </section>
    </PageContainer>
  )
}
