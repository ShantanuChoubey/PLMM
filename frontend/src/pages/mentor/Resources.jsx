import { useMemo, useState } from 'react'
import { FileText } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { EmptyState } from '@/components/common/EmptyState'
import { ResourceCard } from '@/components/shared/ResourceCard'
import { ResourceFilters } from '@/components/mentor/ResourceFilters'
import { UploadResourceModal } from '@/components/mentor/UploadResourceModal'
import { MENTOR_RESOURCES } from '@/mock/resourceData'

export default function MentorResourcesPage() {
  const [resources, setResources] = useState(MENTOR_RESOURCES)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
      const matchType = type === 'all' || r.type === type
      const matchCat = category === 'all' || r.category === category
      return matchSearch && matchType && matchCat
    })
  }, [resources, search, type, category])

  const handleUpload = (data) => {
    setResources((c) => [{ id: `res-${Date.now()}`, ...data, uploadedAt: new Date().toISOString().slice(0, 10), downloads: 0 }, ...c])
  }

  return (
    <PageContainer title="Resources" description="Upload and manage learning resources for mentees." actions={<UploadResourceModal onUpload={handleUpload} />}>
      <div className="mb-6 rounded-xl border border-border/70 bg-card/40 p-4">
        <ResourceFilters search={search} onSearchChange={setSearch} type={type} onTypeChange={setType} category={category} onCategoryChange={setCategory} />
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No resources found" description="Try adjusting filters or upload a new resource." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}
    </PageContainer>
  )
}
