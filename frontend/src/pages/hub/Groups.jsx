import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Users } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { EmptyState } from '@/components/common/EmptyState'
import { CategoryFilter } from '@/components/hub/CategoryFilter'
import { CreateGroupModal } from '@/components/hub/CreateGroupModal'
import { GroupCard } from '@/components/hub/GroupCard'
import { SearchFilters } from '@/components/hub/SearchFilters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { STUDY_GROUPS } from '@/mock/groupsData'
import { GROUP_CATEGORIES } from '@/mock/resourceCategories'
import { GROUP_GROWTH_CHART, COMMUNITY_ACTIVITY_CHART } from '@/mock/groupsData'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

export default function GroupsPage({ groupsBasePath, title = 'Study Groups', description = 'Discover and join collaborative learning communities.' }) {
  const [groups, setGroups] = useState(STUDY_GROUPS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    let result = [...groups]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q) || g.tags.some((t) => t.toLowerCase().includes(q)))
    }
    if (category !== 'all') result = result.filter((g) => g.category === category)
    if (filter === 'my') result = result.filter((g) => g.isJoined)
    if (filter === 'trending') result = result.filter((g) => g.trending)
    if (filter === 'recommended') result = result.filter((g) => g.recommended)
    return result
  }, [groups, search, category, filter])

  const handleJoin = (id) => {
    setGroups((c) => c.map((g) => g.id === id ? { ...g, isJoined: true, memberCount: g.memberCount + 1 } : g))
    toast.success('Joined group (mock).')
  }

  const handleLeave = (id) => {
    setGroups((c) => c.map((g) => g.id === id ? { ...g, isJoined: false, memberCount: Math.max(0, g.memberCount - 1) } : g))
    toast.success('Left group (mock).')
  }

  const handleCreate = (group) => {
    setGroups((c) => [{ ...group, visibility: group.visibility }, ...c])
  }

  const tabs = [
    { id: 'all', label: 'All Groups' },
    { id: 'my', label: 'My Groups' },
    { id: 'trending', label: 'Trending' },
    { id: 'recommended', label: 'Recommended' },
  ]

  return (
    <PageContainer title={title} description={description} actions={<CreateGroupModal onCreate={handleCreate} />}>
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader><CardTitle className="text-base">Group Growth</CardTitle></CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GROUP_GROWTH_CHART}>
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
              <BarChart data={COMMUNITY_ACTIVITY_CHART}>
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
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filter === tab.id}
            onClick={() => setFilter(tab.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${filter === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <SearchFilters search={search} onSearchChange={setSearch} className="mb-6">
        <CategoryFilter categories={GROUP_CATEGORIES} value={category} onChange={setCategory} />
      </SearchFilters>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No groups found" description="Try adjusting your search or filters." actionLabel="Clear Filters" onAction={() => { setSearch(''); setCategory('all'); setFilter('all') }} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((group) => (
            <GroupCard key={group.id} group={group} groupsBasePath={groupsBasePath} onJoin={handleJoin} onLeave={handleLeave} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
