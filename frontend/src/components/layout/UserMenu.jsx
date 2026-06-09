import { Link } from 'react-router-dom'
import { LogOut, Settings, User } from 'lucide-react'
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
import { getProfileRouteForRole, getSettingsRouteForRole } from '@/constants/navigation'
import { getRoleLabel } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function UserMenu({ className, showName = true }) {
  const { user, logout, loading } = useAuth()

  if (!user) {
    return null
  }

  const initials = getInitials(user.name)
  const profileRoute = getProfileRouteForRole(user.role)
  const settingsRoute = getSettingsRouteForRole(user.role)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn('gap-2 px-2 sm:px-3', className)}
          aria-label="Open user menu"
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {initials || <User className="h-3.5 w-3.5" />}
          </span>
          {showName ? (
            <span className="hidden max-w-[8rem] truncate text-sm md:inline">{user.name}</span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="space-y-2">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
          <Badge variant="secondary" className="w-fit">
            {getRoleLabel(user.role)}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={profileRoute}>
            <User className="h-4 w-4" aria-hidden="true" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={settingsRoute}>
            <Settings className="h-4 w-4" aria-hidden="true" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            logout()
          }}
          disabled={loading}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
