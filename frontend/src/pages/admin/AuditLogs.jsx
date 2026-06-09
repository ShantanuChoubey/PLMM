import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { DataTable, Pagination } from '@/components/admin/DataTable'
import { ExportButton } from '@/components/admin/ExportButton'
import { FilterBar, FilterSelect } from '@/components/admin/FilterBar'
import { PageContainer } from '@/components/layout/PageContainer'
import { Badge } from '@/components/ui/badge'
import { AUDIT_ACTION_TYPES, AUDIT_ENTITY_TYPES, AUDIT_LOGS } from '@/mock/auditLogsData'

const PAGE_SIZE = 10
const MOCK_NOW = new Date('2026-06-10T12:00:00Z').getTime()

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [entityFilter, setEntityFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = [...AUDIT_LOGS]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((l) => l.description.toLowerCase().includes(q) || l.admin.toLowerCase().includes(q) || l.entityId.toLowerCase().includes(q))
    }
    if (actionFilter !== 'all') result = result.filter((l) => l.action === actionFilter)
    if (entityFilter !== 'all') result = result.filter((l) => l.entityType === entityFilter)
    if (dateRange === '7d') {
      const cutoff = MOCK_NOW - 7 * 24 * 60 * 60 * 1000
      result = result.filter((l) => new Date(l.timestamp).getTime() >= cutoff)
    }
    if (dateRange === '30d') {
      const cutoff = MOCK_NOW - 30 * 24 * 60 * 60 * 1000
      result = result.filter((l) => new Date(l.timestamp).getTime() >= cutoff)
    }
    return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [search, actionFilter, entityFilter, dateRange])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns = [
    { key: 'timestamp', header: 'Timestamp', render: (l) => format(new Date(l.timestamp), 'MMM d, yyyy HH:mm') },
    { key: 'admin', header: 'Admin' },
    { key: 'action', header: 'Action', render: (l) => <Badge variant="outline" className="capitalize">{l.action}</Badge> },
    { key: 'entityType', header: 'Entity Type', render: (l) => <span className="capitalize">{l.entityType}</span> },
    { key: 'entityId', header: 'Entity ID' },
    { key: 'description', header: 'Description', className: 'max-w-xs' },
  ]

  return (
    <PageContainer title="Audit Logs" description="Review administrative actions and system events." actions={<ExportButton label="Export Audit Logs" />}>
      <FilterBar search={search} onSearchChange={(v) => { setSearch(v); setPage(1) }} searchPlaceholder="Search logs...">
        <FilterSelect id="date-range" label="Date Range" value={dateRange} onChange={(v) => { setDateRange(v); setPage(1) }} options={[{ value: 'all', label: 'All Time' }, { value: '7d', label: 'Last 7 Days' }, { value: '30d', label: 'Last 30 Days' }]} />
        <FilterSelect id="action-type" label="Action Type" value={actionFilter} onChange={(v) => { setActionFilter(v); setPage(1) }} options={AUDIT_ACTION_TYPES.map((a) => ({ value: a, label: a === 'all' ? 'All Actions' : a.charAt(0).toUpperCase() + a.slice(1) }))} />
        <FilterSelect id="entity-type" label="Entity Type" value={entityFilter} onChange={(v) => { setEntityFilter(v); setPage(1) }} options={AUDIT_ENTITY_TYPES.map((e) => ({ value: e, label: e === 'all' ? 'All Entities' : e.charAt(0).toUpperCase() + e.slice(1) }))} />
      </FilterBar>

      <div className="mt-6 space-y-4">
        <DataTable columns={columns} data={paginated} />
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </PageContainer>
  )
}
