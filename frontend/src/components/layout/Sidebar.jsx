import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/Logo'
import { FACULTY_ROUTES, LEARNER_ROUTES, MENTOR_ROUTES, PROTECTED_ROUTES } from '@/constants/routes'
import { useNavigation } from '@/hooks/useNavigation'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/lib/utils'

const DASHBOARD_ROOTS = new Set([
  ...Object.values(PROTECTED_ROUTES),
  LEARNER_ROUTES.DASHBOARD,
  MENTOR_ROUTES.DASHBOARD,
  FACULTY_ROUTES.DASHBOARD,
])

function SidebarNav({ collapsed, onNavigate }) {
  const navigation = useNavigation()

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Dashboard navigation">
      {navigation.map((group) => (
        <div key={group.group}>
          {!collapsed ? (
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.group}
            </p>
          ) : null}
          <ul className="space-y-1">
            {group.items.map((item) => (
              <li key={item.route}>
                <NavLink
                  to={item.route}
                  end={DASHBOARD_ROOTS.has(item.route)}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                      collapsed && 'justify-center px-2',
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {!collapsed ? <span className="truncate">{item.label}</span> : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function Sidebar() {
  const { collapsed, toggleCollapsed } = useSidebar()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden h-screen shrink-0 border-r border-border/60 bg-card/30 lg:flex lg:flex-col"
      aria-label="Sidebar"
    >
      <div
        className={cn(
          'flex h-16 items-center border-b border-border/60 px-4',
          collapsed && 'justify-center px-2',
        )}
      >
        {collapsed ? (
          <span className="text-sm font-semibold">P</span>
        ) : (
          <Logo />
        )}
      </div>

      <SidebarNav collapsed={collapsed} />

      <div className="border-t border-border/60 p-3">
        <Button
          type="button"
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          onClick={toggleCollapsed}
          className={cn('w-full', !collapsed && 'justify-start')}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </motion.aside>
  )
}

export { SidebarNav }
