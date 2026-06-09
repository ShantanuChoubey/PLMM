import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { Container } from '@/components/common/Container'
import { ROUTES } from '@/constants/routes'

const footerLinks = [
  { to: ROUTES.HOME, label: 'Home' },
  { to: ROUTES.ABOUT, label: 'About' },
  { to: ROUTES.LOGIN, label: 'Login' },
  { to: ROUTES.REGISTER, label: 'Register' },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-md text-sm text-muted-foreground">
              Peer Learning & Mentor Matching Platform — connecting learners with the
              right mentors to accelerate growth through structured peer learning.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Platform
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} PLMM. All rights reserved.</p>
          <p>Built for scalable peer learning experiences.</p>
        </div>
      </Container>
    </footer>
  )
}
