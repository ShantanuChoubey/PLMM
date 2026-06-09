import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Star } from 'lucide-react'
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog'
import { DataTable } from '@/components/admin/DataTable'
import { ExportButton } from '@/components/admin/ExportButton'
import { FilterBar } from '@/components/admin/FilterBar'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ADMIN_MENTORS } from '@/mock/mentorsAdminData'

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState(ADMIN_MENTORS)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(ADMIN_MENTORS[0])
  const [confirmAction, setConfirmAction] = useState(null)

  const filtered = useMemo(() => {
    if (!search) return mentors
    const q = search.toLowerCase()
    return mentors.filter((m) => m.name.toLowerCase().includes(q) || m.expertise.some((e) => e.toLowerCase().includes(q)))
  }, [mentors, search])

  const handleApprove = (mentor) => {
    setMentors((c) => c.map((m) => m.id === mentor.id ? { ...m, status: 'active' } : m))
    setSelected((s) => s?.id === mentor.id ? { ...s, status: 'active' } : s)
    toast.success(`${mentor.name} approved (mock).`)
  }

  const handleSuspend = (mentor) => {
    setConfirmAction({ mentor, title: 'Suspend Mentor', description: `Suspend ${mentor.name}? They will lose access to mentoring features.` })
  }

  const columns = [
    { key: 'name', header: 'Name', render: (m) => <span className="font-medium">{m.name}</span> },
    { key: 'expertise', header: 'Expertise', render: (m) => m.expertise.join(', ') },
    { key: 'rating', header: 'Rating', render: (m) => (
      <span className="flex items-center gap-1">{m.rating > 0 ? <><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />{m.rating}</> : '—'}</span>
    ) },
    { key: 'sessions', header: 'Sessions', render: (m) => m.sessionsCompleted },
    { key: 'students', header: 'Students', render: (m) => m.studentsMentored },
    { key: 'status', header: 'Status', render: (m) => <StatusBadge status={m.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (m) => (
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(m)}>View</Button>
          {m.status === 'pending' ? <Button type="button" size="sm" onClick={() => handleApprove(m)}>Approve</Button> : null}
          {m.status === 'active' ? <Button type="button" variant="outline" size="sm" onClick={() => handleSuspend(m)}>Suspend</Button> : null}
        </div>
      ),
    },
  ]

  return (
    <PageContainer title="Mentor Management" description="Review mentor performance, ratings, and activity." actions={<ExportButton label="Export Mentors" />}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search mentors..." />
          <DataTable columns={columns} data={filtered} onRowClick={setSelected} />
        </div>
        {selected ? (
          <Card className="border-border/70 h-fit">
            <CardHeader>
              <CardTitle>{selected.name}</CardTitle>
              <StatusBadge status={selected.status} />
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <section>
                <h3 className="mb-2 font-medium text-muted-foreground">Profile</h3>
                <p>{selected.email}</p>
                <p className="mt-1 text-muted-foreground">{selected.expertise.join(' · ')}</p>
              </section>
              <section>
                <h3 className="mb-2 font-medium text-muted-foreground">Availability</h3>
                <p>{selected.availability}</p>
              </section>
              <section>
                <h3 className="mb-2 font-medium text-muted-foreground">Performance</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-border/60 p-2 text-center"><p className="text-lg font-semibold">{selected.rating || '—'}</p><p className="text-xs text-muted-foreground">Rating</p></div>
                  <div className="rounded-lg border border-border/60 p-2 text-center"><p className="text-lg font-semibold">{selected.reviews}</p><p className="text-xs text-muted-foreground">Reviews</p></div>
                  <div className="rounded-lg border border-border/60 p-2 text-center"><p className="text-lg font-semibold">{selected.sessionsCompleted}</p><p className="text-xs text-muted-foreground">Sessions</p></div>
                  <div className="rounded-lg border border-border/60 p-2 text-center"><p className="text-lg font-semibold">{selected.responseRate}%</p><p className="text-xs text-muted-foreground">Response</p></div>
                </div>
              </section>
              <section>
                <h3 className="mb-2 font-medium text-muted-foreground">Recent Activity</h3>
                <ul className="space-y-2">
                  {selected.activity.map((a) => (
                    <li key={a.action} className="text-xs"><span className="font-medium">{a.action}</span> · {a.date}</li>
                  ))}
                </ul>
              </section>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <ConfirmationDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction?.title}
        description={confirmAction?.description}
        confirmLabel="Suspend"
        onConfirm={() => {
          const mentor = confirmAction.mentor
          setMentors((c) => c.map((m) => m.id === mentor.id ? { ...m, status: 'suspended' } : m))
          setSelected((s) => s?.id === mentor.id ? { ...s, status: 'suspended' } : s)
          toast.success(`${mentor.name} suspended (mock).`)
        }}
      />
    </PageContainer>
  )
}
