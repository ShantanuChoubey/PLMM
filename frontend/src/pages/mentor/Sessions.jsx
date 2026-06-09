import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { EmptyState } from '@/components/common/EmptyState'
import { MentorSessionRequestCard } from '@/components/mentor/MentorSessionRequestCard'
import { Button } from '@/components/ui/button'
import { MENTOR_SESSIONS, MENTOR_SESSION_TABS } from '@/mock/mentorSessionData'
import { cn } from '@/lib/utils'

export default function MentorSessionsPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [sessions, setSessions] = useState(MENTOR_SESSIONS)

  const filtered = sessions.filter((s) => s.status === activeTab)

  const handleStatusChange = (id, status) => {
    setSessions((c) => c.map((s) => (s.id === id ? { ...s, status } : s)))
  }

  return (
    <PageContainer title="Sessions" description="Manage session requests and mentoring appointments.">
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Session filters">
        {MENTOR_SESSION_TABS.map((tab) => (
          <Button key={tab} type="button" role="tab" aria-selected={activeTab === tab} variant={activeTab === tab ? 'default' : 'outline'} size="sm" className={cn('capitalize')} onClick={() => setActiveTab(tab)}>{tab}</Button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Calendar} title={`No ${activeTab} sessions`} description={`You have no ${activeTab} sessions.`} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((session) => (
            <MentorSessionRequestCard key={session.id} session={session} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
