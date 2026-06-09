import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { MoreHorizontal } from 'lucide-react'
import { ConfirmationDialog } from '@/components/admin/ConfirmationDialog'
import { DataTable, Pagination } from '@/components/admin/DataTable'
import { ExportButton } from '@/components/admin/ExportButton'
import { FilterBar, FilterSelect } from '@/components/admin/FilterBar'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { UserDetailsDrawer } from '@/components/admin/UserDetailsDrawer'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROLE_LABELS, ROLE_OPTIONS, ROLES } from '@/constants/roles'
import { ADMIN_USERS, USER_STATUS_OPTIONS } from '@/mock/usersData'

const PAGE_SIZE = 8

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState(ADMIN_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState('name')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null)

  const filtered = useMemo(() => {
    let result = [...users]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    }
    if (roleFilter !== 'all') result = result.filter((u) => u.role === roleFilter)
    if (statusFilter !== 'all') result = result.filter((u) => u.status === statusFilter)
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'joinDate') result.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
    if (sort === 'lastActive') result.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
    return result
  }, [users, search, roleFilter, statusFilter, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleAction = (user, action) => {
    if (action === 'delete') {
      setConfirmAction({ user, action, title: 'Delete User', description: `Permanently delete ${user.name}? This cannot be undone.` })
      return
    }
    if (action === 'suspend') {
      setUsers((c) => c.map((u) => u.id === user.id ? { ...u, status: 'suspended' } : u))
      toast.success(`${user.name} suspended (mock).`)
    }
    if (action === 'activate') {
      setUsers((c) => c.map((u) => u.id === user.id ? { ...u, status: 'active' } : u))
      toast.success(`${user.name} activated (mock).`)
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{getInitials(u.name)}</span>
          <div>
            <p className="font-medium">{u.name}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: (u) => ROLE_LABELS[u.role] ?? u.role },
    { key: 'status', header: 'Status', render: (u) => <StatusBadge status={u.status} /> },
    { key: 'joinDate', header: 'Join Date', render: (u) => format(new Date(u.joinDate), 'MMM d, yyyy') },
    { key: 'lastActive', header: 'Last Active', render: (u) => format(new Date(u.lastActive), 'MMM d, yyyy') },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-16',
      render: (u) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" aria-label={`Actions for ${u.name}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedUser(u)}>View Details</DropdownMenuItem>
            {u.status !== 'active' ? <DropdownMenuItem onClick={() => handleAction(u, 'activate')}>Activate</DropdownMenuItem> : null}
            {u.status === 'active' ? <DropdownMenuItem onClick={() => handleAction(u, 'suspend')}>Suspend</DropdownMenuItem> : null}
            <DropdownMenuItem className="text-destructive" onClick={() => handleAction(u, 'delete')}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <PageContainer title="User Management" description="Search, filter, and manage platform users." actions={<ExportButton label="Export Users" />}>
      <FilterBar search={search} onSearchChange={(v) => { setSearch(v); setPage(1) }} searchPlaceholder="Search users...">
        <FilterSelect id="role-filter" label="Role" value={roleFilter} onChange={(v) => { setRoleFilter(v); setPage(1) }} options={[{ value: 'all', label: 'All Roles' }, ...ROLE_OPTIONS, { value: ROLES.ADMIN, label: 'Admin' }]} />
        <FilterSelect id="status-filter" label="Status" value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1) }} options={USER_STATUS_OPTIONS.map((s) => ({ value: s, label: s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1) }))} />
        <FilterSelect id="sort-filter" label="Sort By" value={sort} onChange={setSort} options={[{ value: 'name', label: 'Name' }, { value: 'joinDate', label: 'Join Date' }, { value: 'lastActive', label: 'Last Active' }]} />
      </FilterBar>

      <div className="mt-6 space-y-4">
        <DataTable columns={columns} data={paginated} onRowClick={setSelectedUser} />
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      <UserDetailsDrawer user={selectedUser} open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)} />

      <ConfirmationDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction?.title}
        description={confirmAction?.description}
        confirmLabel="Delete"
        onConfirm={() => {
          setUsers((c) => c.filter((u) => u.id !== confirmAction.user.id))
          toast.success('User deleted (mock).')
        }}
      />
    </PageContainer>
  )
}
