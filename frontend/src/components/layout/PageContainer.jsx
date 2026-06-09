import { cn } from '@/lib/utils'

export function PageContainer({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8', className)}>
      {title || description || actions ? (
        <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            {title ? (
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            ) : null}
            {description ? (
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={contentClassName}>{children}</div>
    </div>
  )
}
