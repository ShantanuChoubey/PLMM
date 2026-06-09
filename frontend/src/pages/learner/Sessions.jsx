import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { EmptyState } from '@/components/common/EmptyState'
import { SessionCard } from '@/components/learner/SessionCard'
import { SessionCardSkeleton } from '@/components/learner/skeletons/LearnerSkeletons'
import { Button } from '@/components/ui/button'
import { useMockLoading } from '@/hooks/useMockLoading'
import { LEARNER_SESSIONS, SESSION_TABS } from '@/mock/sessionData'
import { cn } from '@/lib/utils'

export default function LearnerSessionsPage() {
  const loading = useMockLoading(500)
  const [activeTab, setActiveTab] = useState('upcoming')

  const sessions = LEARNER_SESSIONS.filter((s) => s.status === activeTab)

  return (
    <PageContainer
      title="Sessions"
      description="Manage your upcoming, pending, completed, and cancelled mentoring sessions."
    >
      <div
        className="mb-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Session filters"
      >
        {SESSION_TABS.map((tab) => (
          <Button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            size="sm"
            className={cn('capitalize')}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab} sessions`}
          description={`You don't have any ${activeTab} sessions right now.`}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
