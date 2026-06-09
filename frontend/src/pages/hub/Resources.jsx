import { useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { EmptyState } from '@/components/common/EmptyState'
import { BookmarkedResources } from '@/components/hub/BookmarkedResources'
import { CategoryFilter } from '@/components/hub/CategoryFilter'
import { HubResourceCard } from '@/components/hub/ResourceCard'
import { RecommendedResources } from '@/components/hub/RecommendedResources'
import { ResourceDetailsModal } from '@/components/hub/ResourceDetailsModal'
import { SearchFilters } from '@/components/hub/SearchFilters'
import { UploadResourceModal } from '@/components/hub/UploadResourceModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BOOKMARKED_RESOURCE_IDS } from '@/mock/bookmarkedResources'
import { HUB_RESOURCE_CATEGORIES, HUB_RESOURCE_TYPES, RESOURCE_SORT_OPTIONS } from '@/mock/resourceCategories'
import { RECOMMENDED_HUB_RESOURCES } from '@/mock/recommendedResources'
import { HUB_RESOURCES, RESOURCE_USAGE_CHART } from '@/mock/resourceData'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

export default function ResourcesHubPage({ title = 'Resource Hub', description = 'Discover, bookmark, and share learning resources.' }) {
  const [resources, setResources] = useState(HUB_RESOURCES)
  const [bookmarkedIds, setBookmarkedIds] = useState(BOOKMARKED_RESOURCE_IDS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [type, setType] = useState('all')
  const [sort, setSort] = useState('newest')
  const [activeTab, setActiveTab] = useState('discover')
  const [selectedResource, setSelectedResource] = useState(null)

  const filtered = useMemo(() => {
    let result = [...resources]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)))
    }
    if (category !== 'all') result = result.filter((r) => r.category === category)
    if (type !== 'all') result = result.filter((r) => r.type === type)
    if (sort === 'newest') result.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    if (sort === 'popular') result.sort((a, b) => b.views - a.views)
    if (sort === 'downloads') result.sort((a, b) => b.downloads - a.downloads)
    if (sort === 'recent') result.sort((a, b) => (b.recentlyViewed ? 1 : 0) - (a.recentlyViewed ? 1 : 0))
    return result
  }, [resources, search, category, type, sort])

  const bookmarkedResources = resources.filter((r) => bookmarkedIds.includes(r.id))

  const toggleBookmark = (id) => {
    setBookmarkedIds((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id])
  }

  const tabs = [
    { id: 'discover', label: 'Discover' },
    { id: 'bookmarks', label: 'Bookmarks' },
    { id: 'recommended', label: 'Recommended' },
  ]

  return (
    <PageContainer title={title} description={description} actions={<UploadResourceModal onUpload={(r) => setResources((c) => [r, ...c])} />}>
      <Card className="mb-6 border-border/70">
        <CardHeader><CardTitle className="text-base">Resource Usage</CardTitle></CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={RESOURCE_USAGE_CHART}>
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
            <CategoryFilter categories={HUB_RESOURCE_CATEGORIES} value={category} onChange={setCategory} label="Category" />
            <CategoryFilter categories={HUB_RESOURCE_TYPES} value={type} onChange={setType} label="Type" />
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sort By</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" aria-label="Sort resources">
                {RESOURCE_SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </SearchFilters>
          {filtered.length === 0 ? (
            <EmptyState icon={FileText} title="No resources found" description="Try adjusting your filters." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((r) => (
                <HubResourceCard key={r.id} resource={r} onView={setSelectedResource} isBookmarked={bookmarkedIds.includes(r.id)} onBookmark={toggleBookmark} />
              ))}
            </div>
          )}
        </>
      ) : null}

      {activeTab === 'bookmarks' ? (
        <BookmarkedResources resources={bookmarkedResources} bookmarkedIds={bookmarkedIds} onView={setSelectedResource} onBookmark={toggleBookmark} />
      ) : null}

      {activeTab === 'recommended' ? (
        <RecommendedResources resources={RECOMMENDED_HUB_RESOURCES} onView={setSelectedResource} />
      ) : null}

      <ResourceDetailsModal resource={selectedResource} open={Boolean(selectedResource)} onOpenChange={(open) => !open && setSelectedResource(null)} isBookmarked={selectedResource ? bookmarkedIds.includes(selectedResource.id) : false} onBookmark={toggleBookmark} />
    </PageContainer>
  )
}
