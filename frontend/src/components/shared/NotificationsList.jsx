import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Bell } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { NotificationCard } from '@/components/learner/NotificationCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'read', label: 'Read' },
]

export function NotificationsList({ initialNotifications, description }) {
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState(initialNotifications)

  const filtered = useMemo(() => {
    if (activeTab === 'unread') return notifications.filter((n) => !n.read)
    if (activeTab === 'read') return notifications.filter((n) => n.read)
    return notifications
  }, [activeTab, notifications])

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    toast.success('Marked as read (mock).')
  }

  return (
    <>
      {description ? <p className="mb-4 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Notification filters">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description={`You have no ${activeTab === 'all' ? '' : activeTab} notifications.`} />
      ) : (
        <div className="space-y-3">
          {filtered.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onClick={() => !notification.read && markAsRead(notification.id)}
              className={cn(!notification.read && 'cursor-pointer')}
            />
          ))}
        </div>
      )}
    </>
  )
}
