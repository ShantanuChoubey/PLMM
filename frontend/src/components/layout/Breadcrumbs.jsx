import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'
import { cn } from '@/lib/utils'

export function Breadcrumbs({ className }) {
  const breadcrumbs = useBreadcrumbs()

  if (!breadcrumbs.length) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 ? (
                <li aria-hidden="true">
                  <ChevronRight className="h-3.5 w-3.5" />
                </li>
              ) : null}
              <li className="truncate">
                {crumb.href && !isLast ? (
                  <Link
                    to={crumb.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(isLast && 'font-medium text-foreground')}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
