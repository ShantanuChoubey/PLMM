import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { DataTable, Pagination } from '@/components/admin/DataTable'
import { ExportButton } from '@/components/admin/ExportButton'
import { FilterBar, FilterSelect } from '@/components/admin/FilterBar'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ADMIN_SESSIONS, SESSION_STATUS_OPTIONS } from '@/mock/sessionsAdminData'

const PAGE_SIZE = 8

export default function AdminSessionsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = [...ADMIN_SESSIONS]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((s) => s.topic.toLowerCase().includes(q) || s.learner.toLowerCase().includes(q) || s.mentor.toLowerCase().includes(q))
    }
    if (statusFilter !== 'all') result = result.filter((s) => s.status === statusFilter)
    return result
  }, [search, statusFilter])

  const stats = useMemo(() => ({
    total: ADMIN_SESSIONS.length,
    completed: ADMIN_SESSIONS.filter((s) => s.status === 'completed').length,
    cancelled: ADMIN_SESSIONS.filter((s) => s.status === 'cancelled').length,
    pending: ADMIN_SESSIONS.filter((s) => s.status === 'pending').length,
  }), [])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns = [
    { key: 'topic', header: 'Topic', render: (s) => <span className="font-medium">{s.topic}</span> },
    { key: 'learner', header: 'Learner' },
    { key: 'mentor', header: 'Mentor' },
    { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
    { key: 'date', header: 'Date', render: (s) => format(new Date(s.date), 'MMM d, yyyy') },
    { key: 'duration', header: 'Duration' },
  ]

  return (
    <PageContainer title="Session Monitoring" description="View and monitor all platform mentoring sessions." actions={<ExportButton label="Export Sessions" />}>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/70"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold">{stats.total}</p></CardContent></Card>
        <Card className="border-border/70"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Completed</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-emerald-500">{stats.completed}</p></CardContent></Card>
        <Card className="border-border/70"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Cancelled</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-rose-500">{stats.cancelled}</p></CardContent></Card>
        <Card className="border-border/70"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending</CardTitle></CardHeader><CardContent><p className="text-2xl font-semibold text-amber-500">{stats.pending}</p></CardContent></Card>
      </div>

      <FilterBar search={search} onSearchChange={(v) => { setSearch(v); setPage(1) }} searchPlaceholder="Search sessions...">
        <FilterSelect id="session-status" label="Status" value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1) }} options={SESSION_STATUS_OPTIONS.map((s) => ({ value: s, label: s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1) }))} />
      </FilterBar>

      <div className="mt-6 space-y-4">
        <DataTable columns={columns} data={paginated} />
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </PageContainer>
  )
}
