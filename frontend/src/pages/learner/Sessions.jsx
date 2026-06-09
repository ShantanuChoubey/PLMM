import { PageContainer } from '@/components/layout/PageContainer'
import { PresetEmptyState } from '@/components/common/emptyStates'
import { QueryErrorState } from '@/components/common/QueryErrorState'
import { SessionCard } from '@/components/learner/SessionCard'
import { SessionCardSkeleton } from '@/components/learner/skeletons/LearnerSkeletons'
import { Button } from '@/components/ui/button'
import { useLearnerSessions } from '@/hooks/api/useSessions'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function LearnerSessionsPage() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const { data, isLoading, isError, error, refetch } = useLearnerSessions({ status: activeTab })
  const sessions = data?.data ?? []
  const tabs = data?.meta?.tabs ?? ['upcoming', 'pending', 'completed', 'cancelled']

  return (
    <PageContainer title="Sessions" description="Manage your upcoming, pending, completed, and cancelled mentoring sessions.">
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Session filters">
        {tabs.map((tab) => (
          <Button key={tab} type="button" role="tab" aria-selected={activeTab === tab} variant={activeTab === tab ? 'default' : 'outline'} size="sm" className={cn('capitalize')} onClick={() => setActiveTab(tab)}>
            {tab}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SessionCardSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <QueryErrorState error={error} onRetry={refetch} />
      ) : sessions.length === 0 ? (
        <PresetEmptyState type="sessions" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {sessions.map((session) => <SessionCard key={session.id} session={session} />)}
        </div>
      )}
    </PageContainer>
  )
}
