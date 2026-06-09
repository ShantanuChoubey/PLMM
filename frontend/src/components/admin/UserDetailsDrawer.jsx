import { format } from 'date-fns'
import { X } from 'lucide-react'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { ROLE_LABELS } from '@/constants/roles'
import { cn } from '@/lib/utils'

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
}

export function UserDetailsDrawer({ user, open, onClose }) {
  if (!open || !user) return null

  const stats = [
    { label: 'Groups Joined', value: user.groupsJoined },
    { label: 'Sessions Completed', value: user.sessionsCompleted },
    { label: 'Resources Shared', value: user.resourcesShared },
  ]

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-label="User details"
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-xl',
          'animate-in slide-in-from-right duration-200',
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">User Details</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close drawer">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {getInitials(user.name)}
            </span>
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex gap-2">
                <StatusBadge status={user.status} />
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{ROLE_LABELS[user.role] ?? user.role}</span>
              </div>
            </div>
          </div>

          <section>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Profile Information</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Join Date</dt><dd>{format(new Date(user.joinDate), 'MMM d, yyyy')}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Last Active</dt><dd>{format(new Date(user.lastActive), 'MMM d, yyyy')}</dd></div>
            </dl>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Activity Summary</h3>
            <div className="grid grid-cols-3 gap-2">
              {stats.map((s) => (
                <div key={s.label} className="rounded-lg border border-border/60 p-3 text-center">
                  <p className="text-xl font-semibold">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  )
}
