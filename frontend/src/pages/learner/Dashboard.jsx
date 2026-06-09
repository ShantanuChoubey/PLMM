import { PageContainer } from '@/components/layout/PageContainer'
import { DashboardSkeleton } from '@/components/common/skeletons/AppSkeletons'
import { QueryErrorState } from '@/components/common/QueryErrorState'
import { ActivityWidget } from '@/components/learner/widgets/ActivityWidget'
import { DashboardWelcomeCard } from '@/components/learner/widgets/DashboardWelcomeCard'
import { NotificationWidget } from '@/components/learner/widgets/NotificationWidget'
import { ProgressWidget } from '@/components/learner/widgets/ProgressWidget'
import { RecommendationWidget } from '@/components/learner/widgets/RecommendationWidget'
import { SessionWidget } from '@/components/learner/widgets/SessionWidget'
import { MyGroupsWidget, RecentGroupActivityWidget, RecommendedResourcesWidget } from '@/components/hub/widgets/LearnerHubWidgets'
import { StatCard } from '@/components/ui/StatCard'
import { useLearnerDashboard } from '@/hooks/api/useUsers'
import { Calendar, TrendingUp, Users, UsersRound } from 'lucide-react'

export default function LearnerDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useLearnerDashboard()
  const metrics = data?.data?.metrics

  if (isLoading) {
    return (
      <PageContainer title="Dashboard" description="Your learning overview at a glance.">
        <DashboardSkeleton />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer title="Dashboard" description="Your learning overview at a glance.">
        <QueryErrorState error={error} onRetry={refetch} />
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Dashboard" description="Your learning overview at a glance.">
      <div className="space-y-6">
        <DashboardWelcomeCard />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Upcoming Sessions" value={String(metrics?.upcomingSessions ?? 0)} icon={Calendar} description="Scheduled in the next two weeks" />
          <StatCard title="Active Mentors" value={String(metrics?.activeMentors ?? 0)} icon={Users} description="Mentors you are working with" />
          <StatCard title="Study Groups" value={String(metrics?.studyGroupsJoined ?? 0)} icon={UsersRound} description="Groups you have joined" />
          <StatCard title="Learning Progress" value={`${metrics?.learningProgress ?? 0}%`} icon={TrendingUp} trend="+6% this month" description="Overall goal completion" />
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
