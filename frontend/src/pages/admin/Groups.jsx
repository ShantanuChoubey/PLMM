import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog'
import { DataTable } from '@/components/admin/DataTable'
import { ExportButton } from '@/components/admin/ExportButton'
import { FilterBar } from '@/components/admin/FilterBar'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { TrendCard } from '@/components/admin/TrendCard'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ADMIN_GROUPS } from '@/mock/groupsAdminData'

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState(ADMIN_GROUPS)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null)

  const filtered = useMemo(() => {
    if (!search) return groups
    const q = search.toLowerCase()
    return groups.filter((g) => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q))
  }, [groups, search])

  const columns = [
    { key: 'name', header: 'Group', render: (g) => <span className="font-medium">{g.name}</span> },
    { key: 'category', header: 'Category' },
    { key: 'members', header: 'Members' },
    { key: 'resources', header: 'Resources' },
    { key: 'sessions', header: 'Sessions' },
    { key: 'activityScore', header: 'Activity', render: (g) => `${g.activityScore}%` },
    { key: 'status', header: 'Status', render: (g) => <StatusBadge status={g.flagged ? 'flagged' : g.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (g) => (
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(g)}>Details</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => {
            setGroups((c) => c.map((x) => x.id === g.id ? { ...x, flagged: !x.flagged, status: x.flagged ? 'active' : 'flagged' } : x))
            toast.success(g.flagged ? 'Flag removed (mock).' : 'Group flagged (mock).')
          }}>{g.flagged ? 'Unflag' : 'Flag'}</Button>
          <Button type="button" variant="outline" size="sm" className="text-destructive" onClick={() => setConfirmAction({ group: g })}>Delete</Button>
        </div>
      ),
    },
  ]

  return (
    <PageContainer title="Group Management" description="Monitor study groups, activity, and moderation." actions={<ExportButton label="Export Groups" />}>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TrendCard title="Total Groups" value={groups.length} trend="+4" trendLabel="New this month" />
        <TrendCard title="Avg Members" value="20" trend="+8%" trendLabel="Per group" />
        <TrendCard title="Avg Activity" value="69%" trend="+5%" trendLabel="Activity score" />
        <TrendCard title="Flagged" value={groups.filter((g) => g.flagged).length} trend="-1" trendLabel="Requires review" />
      </div>

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search groups..." />
      <div className="mt-6">
        <DataTable columns={columns} data={filtered} onRowClick={setSelected} />
      </div>

      {selected ? (
        <Card className="mt-6 border-border/70">
          <CardHeader><CardTitle>{selected.name}</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-sm">
            <div><p className="text-muted-foreground">Members</p><p className="text-lg font-semibold">{selected.members}</p></div>
            <div><p className="text-muted-foreground">Resources</p><p className="text-lg font-semibold">{selected.resources}</p></div>
            <div><p className="text-muted-foreground">Sessions</p><p className="text-lg font-semibold">{selected.sessions}</p></div>
            <div><p className="text-muted-foreground">Activity Score</p><p className="text-lg font-semibold">{selected.activityScore}%</p></div>
            <div><p className="text-muted-foreground">Growth</p><p className="text-lg font-semibold">{selected.growthTrend}</p></div>
            <p className="sm:col-span-2 text-muted-foreground">Created by {selected.createdBy} · {selected.category}</p>
          </CardContent>
        </Card>
      ) : null}

      <ConfirmationDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title="Delete Group"
        description={`Delete ${confirmAction?.group?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          setGroups((c) => c.filter((g) => g.id !== confirmAction.group.id))
          setSelected(null)
          toast.success('Group deleted (mock).')
        }}
      />
    </PageContainer>
  )
}
