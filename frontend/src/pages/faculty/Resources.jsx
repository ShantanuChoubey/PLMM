import { useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { EmptyState } from '@/components/common/EmptyState'
import { ResourceCard } from '@/components/shared/ResourceCard'
import { ResourceFilters } from '@/components/mentor/ResourceFilters'
import { UploadResourceModal } from '@/components/mentor/UploadResourceModal'
import { FACULTY_RESOURCES } from '@/mock/resourceData'

export default function FacultyResourcesPage() {
  const [resources, setResources] = useState(FACULTY_RESOURCES)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => resources.filter((r) => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase())
    const matchType = type === 'all' || r.type === type
    const matchCat = category === 'all' || r.category === category
    return matchSearch && matchType && matchCat
  }), [resources, search, type, category])

  return (
    <PageContainer title="Resources" description="Published academic resources for students and mentors." actions={<UploadResourceModal onUpload={(data) => setResources((c) => [{ id: `fres-${Date.now()}`, ...data, uploadedAt: new Date().toISOString().slice(0, 10), downloads: 0 }, ...c])} />}>
      <div className="mb-6 rounded-xl border border-border/70 bg-card/40 p-4">
        <ResourceFilters search={search} onSearchChange={setSearch} type={type} onTypeChange={setType} category={category} onCategoryChange={setCategory} />
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No resources found" description="Try adjusting filters or publish a new resource." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}
    </PageContainer>
  )
}
