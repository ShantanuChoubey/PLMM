import {
  Activity,
  BarChart3,
  Calendar,
  Settings,
  Users,
  UsersRound,
} from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { QuickActionCard } from '@/components/ui/QuickActionCard'
import { StatCard } from '@/components/ui/StatCard'
import { ADMIN_ROUTES } from '@/constants/routes'

export default function AdminDashboard() {
  return (
    <PageContainer
      title="Admin Dashboard"
      description="Monitor platform health, users, and mentorship operations."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value="1,248"
          icon={Users}
          trend="+8.4%"
          description="Registered platform users"
        />
        <StatCard
          title="Active Mentors"
          value="186"
          icon={UsersRound}
          trend="+12"
          description="Mentors available this month"
        />
        <StatCard
          title="Sessions"
          value="342"
          icon={Calendar}
          trend="+18%"
          description="Sessions completed this month"
        />
        <StatCard
          title="Engagement"
          value="92%"
          icon={Activity}
          trend="+3%"
          description="Weekly active user rate"
        />
      </div>

      <section className="mt-8" aria-labelledby="admin-quick-actions">
        <h2 id="admin-quick-actions" className="mb-4 text-lg font-semibold tracking-tight">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Manage Users"
            description="Review and manage platform user accounts."
            icon={Users}
            to={ADMIN_ROUTES.USERS}
          />
          <QuickActionCard
            title="View Analytics"
            description="Explore mentorship and engagement metrics."
            icon={BarChart3}
            to={ADMIN_ROUTES.ANALYTICS}
          />
          <QuickActionCard
            title="Platform Settings"
            description="Configure global platform preferences."
            icon={Settings}
            to={ADMIN_ROUTES.SETTINGS}
          />
        </div>
      </section>
    </PageContainer>
  )
}
