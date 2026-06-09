import { formatDistanceToNow } from 'date-fns'
import { Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MOCK_NOTIFICATIONS } from '@/constants/notifications'
import { cn } from '@/lib/utils'

export function NotificationMenu({ className }) {
  const unreadCount = MOCK_NOTIFICATIONS.filter((item) => !item.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn('relative', className)}
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          {unreadCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 sm:w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 ? (
            <Badge variant="secondary">{unreadCount} unread</Badge>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {MOCK_NOTIFICATIONS.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex cursor-default flex-col items-start gap-1 p-3 focus:bg-accent"
              onSelect={(event) => event.preventDefault()}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <p className="text-sm font-medium leading-none">{notification.title}</p>
                {!notification.read ? (
                  <span
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"
                    aria-label="Unread"
                  />
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
              <p className="text-[11px] text-muted-foreground">
                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
              </p>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center text-center text-sm font-medium"
          onSelect={(event) => event.preventDefault()}
        >
          View All
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
