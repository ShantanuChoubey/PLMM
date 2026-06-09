import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog'
import { DataTable, Pagination } from '@/components/admin/DataTable'
import { ExportButton } from '@/components/admin/ExportButton'
import { FilterBar, FilterSelect } from '@/components/admin/FilterBar'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { ADMIN_RESOURCES } from '@/mock/resourcesAdminData'
import { HUB_RESOURCE_TYPES } from '@/mock/resourceCategories'

const PAGE_SIZE = 8

export default function AdminResourcesPage() {
  const [resources, setResources] = useState(ADMIN_RESOURCES)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [confirmAction, setConfirmAction] = useState(null)

  const filtered = useMemo(() => {
    let result = [...resources]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((r) => r.title.toLowerCase().includes(q) || r.uploader.toLowerCase().includes(q))
    }
    if (typeFilter !== 'all') result = result.filter((r) => r.type === typeFilter)
    return result
  }, [resources, search, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns = [
    { key: 'title', header: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
    { key: 'type', header: 'Type' },
    { key: 'uploader', header: 'Uploader' },
    { key: 'downloads', header: 'Downloads' },
    { key: 'views', header: 'Views' },
    { key: 'category', header: 'Category' },
    { key: 'createdAt', header: 'Created', render: (r) => format(new Date(r.createdAt), 'MMM d, yyyy') },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.flagged ? 'flagged' : r.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex gap-1">
          <Button type="button" variant="outline" size="sm" onClick={() => {
            setResources((c) => c.map((x) => x.id === r.id ? { ...x, flagged: !x.flagged, status: x.flagged ? 'published' : 'flagged' } : x))
            toast.success(r.flagged ? 'Flag removed (mock).' : 'Resource flagged (mock).')
          }}>{r.flagged ? 'Unflag' : 'Flag'}</Button>
          <Button type="button" variant="outline" size="sm" className="text-destructive" onClick={() => setConfirmAction({ resource: r })}>Delete</Button>
        </div>
      ),
    },
  ]

  return (
    <PageContainer title="Resource Monitoring" description="Moderate and monitor platform learning resources." actions={<ExportButton label="Export Resources" />}>
      <FilterBar search={search} onSearchChange={(v) => { setSearch(v); setPage(1) }} searchPlaceholder="Search resources...">
        <FilterSelect id="type-filter" label="Type" value={typeFilter} onChange={(v) => { setTypeFilter(v); setPage(1) }} options={[{ value: 'all', label: 'All Types' }, ...HUB_RESOURCE_TYPES.map((t) => ({ value: t, label: t }))]} />
      </FilterBar>

      <div className="mt-6 space-y-4">
        <DataTable columns={columns} data={paginated} />
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      <ConfirmationDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Delete Resource"
        description={`Delete "${confirmAction?.resource?.title}"?`}
        confirmLabel="Delete"
        onConfirm={() => {
          setResources((c) => c.filter((r) => r.id !== confirmAction.resource.id))
          toast.success('Resource deleted (mock).')
        }}
      />
    </PageContainer>
  )
}
