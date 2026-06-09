import { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { EmptyState } from '@/components/common/EmptyState'
import { MentorCard } from '@/components/common/MentorCard'
import { SearchBar } from '@/components/common/SearchBar'
import { MentorCardSkeleton } from '@/components/learner/skeletons/LearnerSkeletons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMockLoading } from '@/hooks/useMockLoading'
import { DEPARTMENTS, MENTORS, SKILLS } from '@/mock/mentorData'

const SORT_OPTIONS = [
  { value: 'rating-desc', label: 'Highest Rating' },
  { value: 'rating-asc', label: 'Lowest Rating' },
  { value: 'name-asc', label: 'Name A–Z' },
]

const AVAILABILITY_OPTIONS = ['all', 'available', 'busy', 'offline', 'limited']
const RATING_OPTIONS = ['all', '4.5', '4.7', '4.8']

const PAGE_SIZE = 4

export default function LearnerMentorsPage() {
  const loading = useMockLoading(500)
  const [search, setSearch] = useState('')
  const [skill, setSkill] = useState('all')
  const [department, setDepartment] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [minRating, setMinRating] = useState('all')
  const [sort, setSort] = useState('rating-desc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = [...MENTORS]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q)),
      )
    }
    if (skill !== 'all') result = result.filter((m) => m.skills.includes(skill))
    if (department !== 'all') result = result.filter((m) => m.department === department)
    if (availability !== 'all') result = result.filter((m) => m.availability === availability)
    if (minRating !== 'all') result = result.filter((m) => m.rating >= Number(minRating))

    result.sort((a, b) => {
      if (sort === 'rating-desc') return b.rating - a.rating
      if (sort === 'rating-asc') return a.rating - b.rating
      return a.name.localeCompare(b.name)
    })

    return result
  }, [search, skill, department, availability, minRating, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const resetPage = () => setPage(1)

  return (
    <PageContainer
      title="Find Mentors"
      description="Search and filter mentors by skills, department, availability, and rating."
    >
      <Card className="mb-6 border-border/70">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <SearchBar
            placeholder="Search mentors by name, skill, or department..."
            onSearch={(value) => {
              setSearch(value)
              resetPage()
            }}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect
              label="Skill"
              value={skill}
              onChange={(v) => { setSkill(v); resetPage() }}
              options={[{ value: 'all', label: 'All Skills' }, ...SKILLS.map((s) => ({ value: s, label: s }))]}
            />
            <FilterSelect
              label="Department"
              value={department}
              onChange={(v) => { setDepartment(v); resetPage() }}
              options={[{ value: 'all', label: 'All Departments' }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]}
            />
            <FilterSelect
              label="Availability"
              value={availability}
              onChange={(v) => { setAvailability(v); resetPage() }}
              options={AVAILABILITY_OPTIONS.map((v) => ({ value: v, label: v === 'all' ? 'All' : v }))}
            />
            <FilterSelect
              label="Min Rating"
              value={minRating}
              onChange={(v) => { setMinRating(v); resetPage() }}
              options={RATING_OPTIONS.map((v) => ({ value: v, label: v === 'all' ? 'Any Rating' : `${v}+` }))}
            />
            <FilterSelect
              label="Sort"
              value={sort}
              onChange={(v) => { setSort(v); resetPage() }}
              options={SORT_OPTIONS}
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <MentorCardSkeleton key={i} />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No mentors found"
          description="Try adjusting your search or filters to discover more mentors."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('')
            setSkill('all')
            setDepartment('all')
            setAvailability('all')
            setMinRating('all')
            setPage(1)
          }}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {paginated.length} of {filtered.length} mentors
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
          {totalPages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="px-3 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
