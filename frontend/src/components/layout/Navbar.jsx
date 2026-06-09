import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { UserMenu } from '@/components/common/UserMenu'
import { Container } from '@/components/common/Container'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const publicNavLinks = [
  { to: ROUTES.HOME, label: 'Home' },
  { to: ROUTES.ABOUT, label: 'About' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  const guestNavLinks = [
    ...publicNavLinks,
    { to: ROUTES.LOGIN, label: 'Login' },
    { to: ROUTES.REGISTER, label: 'Register' },
  ]

  const navLinks = isAuthenticated ? publicNavLinks : guestNavLinks

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <Container>
        <nav
          className="flex h-16 items-center justify-between"
          aria-label="Main navigation"
        >
          <Logo />

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:inline-flex">
                  <Link to={ROUTES.LOGIN}>Login</Link>
                </Button>
                <Button asChild className="hidden sm:inline-flex">
                  <Link to={ROUTES.REGISTER}>Get Started</Link>
                </Button>
              </>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {mobileOpen ? (
          <div
            id="mobile-nav"
            className="border-t border-border/60 py-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <div className="px-1 pt-2">
                  <UserMenu className="w-full justify-start" />
                </div>
              ) : (
                <div className="mt-2 grid gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  )
}
