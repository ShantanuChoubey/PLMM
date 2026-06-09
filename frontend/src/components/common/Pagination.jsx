import { cn } from '@/lib/utils'

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  mode = 'client',
  className,
}) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <nav
      className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}
      aria-label="Pagination"
    >
      <p className="text-sm text-muted-foreground">
        {totalItems === 0 ? 'No results' : `Showing ${start}–${end} of ${totalItems}`}
        {mode === 'server' ? <span className="sr-only"> (server pagination)</span> : null}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-md border border-input px-3 py-1.5 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="text-sm text-muted-foreground" aria-current="page">
          Page {page} of {Math.max(1, totalPages)}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-md border border-input px-3 py-1.5 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  )
}
