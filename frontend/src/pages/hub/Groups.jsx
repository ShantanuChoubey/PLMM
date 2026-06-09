import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PresetEmptyState } from '@/components/common/emptyStates'
import { QueryErrorState } from '@/components/common/QueryErrorState'
import { GroupCardSkeleton } from '@/components/common/skeletons/AppSkeletons'
import { CategoryFilter } from '@/components/hub/CategoryFilter'
import { CreateGroupModal } from '@/components/hub/CreateGroupModal'
import { GroupCard } from '@/components/hub/GroupCard'
import { SearchFilters } from '@/components/hub/SearchFilters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateGroup, useGroups, useJoinGroup, useLeaveGroup } from '@/hooks/api/useGroups'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

export default function GroupsPage({ groupsBasePath, title = 'Study Groups', description = 'Discover and join collaborative learning communities.' }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [filter, setFilter] = useState('all')

  const { data, isLoading, isError, error, refetch } = useGroups({ search, category, filter })
  const joinGroup = useJoinGroup()
  const leaveGroup = useLeaveGroup()
  const createGroup = useCreateGroup()

  const groups = data?.data ?? []
  const categories = data?.meta?.categories ?? []
  const growthChart = data?.charts?.growth ?? []
  const communityChart = data?.charts?.community ?? []

  const tabs = [
    { id: 'all', label: 'All Groups' },
    { id: 'my', label: 'My Groups' },
    { id: 'trending', label: 'Trending' },
    { id: 'recommended', label: 'Recommended' },
  ]

  return (
    <PageContainer title={title} description={description} actions={<CreateGroupModal onCreate={(g) => createGroup.mutate(g)} />}>
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader><CardTitle className="text-base">Group Growth</CardTitle></CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthChart}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Line type="monotone" dataKey="members" stroke="var(--primary)" strokeWidth={2} name="Members" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardHeader><CardTitle className="text-base">Community Activity</CardTitle></CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={communityChart}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Bar dataKey="resources" fill="var(--primary)" name="Resources" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Group filters">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" role="tab" aria-selected={filter === tab.id} onClick={() => setFilter(tab.id)} className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${filter === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <SearchFilters search={search} onSearchChange={setSearch} className="mb-6">
        <CategoryFilter categories={categories} value={category} onChange={setCategory} />
      </SearchFilters>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <GroupCardSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <QueryErrorState error={error} onRetry={refetch} />
      ) : groups.length === 0 ? (
        <PresetEmptyState type="groups" actionLabel="Clear Filters" onAction={() => { setSearch(''); setCategory('all'); setFilter('all') }} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              groupsBasePath={groupsBasePath}
              onJoin={(id) => joinGroup.mutate(id)}
              onLeave={(id) => leaveGroup.mutate(id)}
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
