import { PageContainer } from '@/components/layout/PageContainer'
import { DashboardWidgetSkeleton } from '@/components/learner/skeletons/LearnerSkeletons'
import { ActivityWidget } from '@/components/learner/widgets/ActivityWidget'
import { DashboardWelcomeCard } from '@/components/learner/widgets/DashboardWelcomeCard'
import { NotificationWidget } from '@/components/learner/widgets/NotificationWidget'
import { ProgressWidget } from '@/components/learner/widgets/ProgressWidget'
import { RecommendationWidget } from '@/components/learner/widgets/RecommendationWidget'
import { SessionWidget } from '@/components/learner/widgets/SessionWidget'
import { MyGroupsWidget, RecentGroupActivityWidget, RecommendedResourcesWidget } from '@/components/hub/widgets/LearnerHubWidgets'
import { StatCard } from '@/components/ui/StatCard'
import { useMockLoading } from '@/hooks/useMockLoading'
import { DASHBOARD_METRICS } from '@/mock/learnerData'
import { Calendar, TrendingUp, Users, UsersRound } from 'lucide-react'

export default function LearnerDashboardPage() {
  const loading = useMockLoading(400)

  if (loading) {
    return (
      <PageContainer title="Dashboard" description="Your learning overview at a glance.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <DashboardWidgetSkeleton key={i} />
          ))}
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Dashboard"
      description="Your learning overview at a glance."
    >
      <div className="space-y-6">
        <DashboardWelcomeCard />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Upcoming Sessions"
            value={String(DASHBOARD_METRICS.upcomingSessions)}
            icon={Calendar}
            description="Scheduled in the next two weeks"
          />
          <StatCard
            title="Active Mentors"
            value={String(DASHBOARD_METRICS.activeMentors)}
            icon={Users}
            description="Mentors you are working with"
          />
          <StatCard
            title="Study Groups"
            value={String(DASHBOARD_METRICS.studyGroupsJoined)}
            icon={UsersRound}
            description="Groups you have joined"
          />
          <StatCard
            title="Learning Progress"
            value={`${DASHBOARD_METRICS.learningProgress}%`}
            icon={TrendingUp}
            trend="+6% this month"
            description="Overall goal completion"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RecommendationWidget />
          <SessionWidget />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <MyGroupsWidget />
          <RecommendedResourcesWidget />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ProgressWidget />
          <RecentGroupActivityWidget />
          <div className="space-y-6">
            <ActivityWidget />
            <NotificationWidget />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
