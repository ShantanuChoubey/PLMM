import { PageContainer } from '@/components/layout/PageContainer'
import { Pagination } from '@/components/common/Pagination'
import { PresetEmptyState } from '@/components/common/emptyStates'
import { QueryErrorState } from '@/components/common/QueryErrorState'
import { MentorCard } from '@/components/common/MentorCard'
import { SearchBar } from '@/components/common/SearchBar'
import { MentorCardSkeleton } from '@/components/learner/skeletons/LearnerSkeletons'
import { Card, CardContent } from '@/components/ui/card'
import { useMentorMeta, useMentors } from '@/hooks/api/useMentors'
import { useSearch } from '@/hooks/useSearch'

const SORT_OPTIONS = [
  { value: 'rating-desc', label: 'Highest Rating' },
  { value: 'rating-asc', label: 'Lowest Rating' },
  { value: 'name-asc', label: 'Name A–Z' },
]

const AVAILABILITY_OPTIONS = ['all', 'available', 'busy', 'offline', 'limited']
const RATING_OPTIONS = ['all', '4.5', '4.7', '4.8']
const PAGE_SIZE = 4

export default function LearnerMentorsPage() {
  const { search, setSearch, filters, setFilter, sort, setSort, page, setPage, queryParams, reset, paginateClient } = useSearch({
    initialFilters: { skill: 'all', department: 'all', availability: 'all', minRating: 'all' },
    initialSort: 'rating-desc',
    pageSize: PAGE_SIZE,
  })

  const { data, isLoading, isError, error, refetch } = useMentors(queryParams)
  const { data: metaData } = useMentorMeta()
  const mentors = data?.data ?? []
  const departments = metaData?.data?.departments ?? []
  const skills = metaData?.data?.skills ?? []
  const { items: paginated, total, totalPages } = paginateClient(mentors)

  return (
    <PageContainer title="Find Mentors" description="Search and filter mentors by skills, department, availability, and rating.">
      <Card className="mb-6 border-border/70">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <SearchBar placeholder="Search mentors by name, skill, or department..." onSearch={setSearch} value={search} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect label="Skill" value={filters.skill} onChange={(v) => setFilter('skill', v)} options={[{ value: 'all', label: 'All Skills' }, ...skills.map((s) => ({ value: s, label: s }))]} />
            <FilterSelect label="Department" value={filters.department} onChange={(v) => setFilter('department', v)} options={[{ value: 'all', label: 'All Departments' }, ...departments.map((d) => ({ value: d, label: d }))]} />
            <FilterSelect label="Availability" value={filters.availability} onChange={(v) => setFilter('availability', v)} options={AVAILABILITY_OPTIONS.map((v) => ({ value: v, label: v === 'all' ? 'All' : v }))} />
            <FilterSelect label="Min Rating" value={filters.minRating} onChange={(v) => setFilter('minRating', v)} options={RATING_OPTIONS.map((v) => ({ value: v, label: v === 'all' ? 'Any Rating' : `${v}+` }))} />
            <FilterSelect label="Sort" value={sort} onChange={setSort} options={SORT_OPTIONS} />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <MentorCardSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <QueryErrorState error={error} onRetry={refetch} />
      ) : paginated.length === 0 ? (
        <PresetEmptyState type="search" actionLabel="Clear Filters" onAction={reset} />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">Showing {paginated.length} of {total} mentors</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((mentor) => <MentorCard key={mentor.id} mentor={mentor} />)}
          </div>
          {totalPages > 1 ? (
            <Pagination className="mt-8" page={page} totalPages={totalPages} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setPage} />
          ) : null}
        </>
      )}
    </PageContainer>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={label}>
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  )
}
