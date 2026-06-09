import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PresetEmptyState } from '@/components/common/emptyStates'
import { QueryErrorState } from '@/components/common/QueryErrorState'
import { ResourceCardSkeleton } from '@/components/common/skeletons/AppSkeletons'
import { BookmarkedResources } from '@/components/hub/BookmarkedResources'
import { CategoryFilter } from '@/components/hub/CategoryFilter'
import { HubResourceCard } from '@/components/hub/ResourceCard'
import { RecommendedResources } from '@/components/hub/RecommendedResources'
import { ResourceDetailsModal } from '@/components/hub/ResourceDetailsModal'
import { SearchFilters } from '@/components/hub/SearchFilters'
import { UploadResourceModal } from '@/components/hub/UploadResourceModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBookmarkedResources, useHubResources, useRecommendedResources, useToggleBookmark, useUploadResource } from '@/hooks/api/useResources'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

export default function ResourcesHubPage({ title = 'Resource Hub', description = 'Discover, bookmark, and share learning resources.' }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [type, setType] = useState('all')
  const [sort, setSort] = useState('newest')
  const [activeTab, setActiveTab] = useState('discover')
  const [selectedResource, setSelectedResource] = useState(null)
  const [bookmarkedIds, setBookmarkedIds] = useState([])

  const params = { search, category, type, sort }
  const { data, isLoading, isError, error, refetch } = useHubResources(params)
  const { data: recommendedData } = useRecommendedResources()
  const { data: bookmarksData } = useBookmarkedResources()
  const uploadResource = useUploadResource()
  const toggleBookmark = useToggleBookmark()

  const resources = data?.data ?? []
  const categories = data?.meta?.categories ?? []
  const types = data?.meta?.types ?? []
  const sortOptions = data?.meta?.sortOptions ?? []
  const usageChart = data?.chart ?? []
  const resolvedBookmarkedIds = bookmarkedIds.length ? bookmarkedIds : (data?.bookmarkedIds ?? bookmarksData?.meta?.bookmarkedIds ?? [])
  const bookmarkedResources = bookmarksData?.data ?? resources.filter((r) => resolvedBookmarkedIds.includes(r.id))
  const recommended = recommendedData?.data ?? []

  const handleBookmark = (id) => {
    setBookmarkedIds((current) => {
      const base = current.length ? current : resolvedBookmarkedIds
      return base.includes(id) ? base.filter((x) => x !== id) : [...base, id]
    })
    toggleBookmark.mutate(id)
  }

  const tabs = [
    { id: 'discover', label: 'Discover' },
    { id: 'bookmarks', label: 'Bookmarks' },
    { id: 'recommended', label: 'Recommended' },
  ]

  return (
    <PageContainer title={title} description={description} actions={<UploadResourceModal onUpload={(r) => uploadResource.mutate(r)} />}>
      <Card className="mb-6 border-border/70">
        <CardHeader><CardTitle className="text-base">Resource Usage</CardTitle></CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageChart}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
              <Area type="monotone" dataKey="views" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} name="Views" />
              <Area type="monotone" dataKey="downloads" stroke="hsl(142 76% 36%)" fill="hsl(142 76% 36%)" fillOpacity={0.1} name="Downloads" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Resource sections">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'discover' ? (
        <>
          <SearchFilters search={search} onSearchChange={setSearch} className="mb-6">
            <CategoryFilter categories={categories} value={category} onChange={setCategory} label="Category" />
            <CategoryFilter categories={types} value={type} onChange={setType} label="Type" />
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sort By</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" aria-label="Sort resources">
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </SearchFilters>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <ResourceCardSkeleton key={i} />)}
            </div>
          ) : isError ? (
            <QueryErrorState error={error} onRetry={refetch} />
          ) : resources.length === 0 ? (
            <PresetEmptyState type="resources" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {resources.map((r) => (
                <HubResourceCard key={r.id} resource={r} onView={setSelectedResource} isBookmarked={resolvedBookmarkedIds.includes(r.id)} onBookmark={handleBookmark} />
              ))}
            </div>
          )}
        </>
      ) : null}

      {activeTab === 'bookmarks' ? (
        <BookmarkedResources resources={bookmarkedResources} bookmarkedIds={resolvedBookmarkedIds} onView={setSelectedResource} onBookmark={handleBookmark} />
      ) : null}

      {activeTab === 'recommended' ? (
        <RecommendedResources resources={recommended} onView={setSelectedResource} />
      ) : null}

      <ResourceDetailsModal resource={selectedResource} open={Boolean(selectedResource)} onOpenChange={(open) => !open && setSelectedResource(null)} isBookmarked={selectedResource ? resolvedBookmarkedIds.includes(selectedResource.id) : false} onBookmark={handleBookmark} />
    </PageContainer>
  )
}
