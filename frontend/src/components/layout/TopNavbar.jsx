import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/common/SearchBar'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { NotificationMenu } from '@/components/layout/NotificationMenu'
import { UserMenu } from '@/components/layout/UserMenu'
import { useSidebar } from '@/hooks/useSidebar'

export function TopNavbar() {
  const { openMobile } = useSidebar()

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={openMobile}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="hidden min-w-0 flex-1 md:block">
          <Breadcrumbs />
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 md:flex-none">
          <SearchBar
            placeholder="Search..."
            className="hidden max-w-xs sm:block lg:max-w-md"
          />
          <ThemeToggle />
          <NotificationMenu />
          <UserMenu />
        </div>
      </div>

      <div className="border-t border-border/60 px-4 py-2 md:hidden">
        <Breadcrumbs />
      </div>
    </header>
  )
}
