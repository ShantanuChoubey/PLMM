import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'

export function Logo({ className }) {
  return (
    <Link
      to={ROUTES.HOME}
      className={cn('group inline-flex items-center gap-2 font-semibold tracking-tight', className)}
      aria-label="PLMM home"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card shadow-sm transition-colors group-hover:bg-accent">
        <GraduationCap className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="text-base sm:text-lg">PLMM</span>
    </Link>
  )
}
