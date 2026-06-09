import { TableLoader } from '@/components/common/TableLoader'
import { EmptyState } from '@/components/common/EmptyState'
import { cn } from '@/lib/utils'

export function DataTable({
  columns,
  data = [],
  keyField = 'id',
  loading = false,
  emptyTitle = 'No data found',
  emptyDescription,
  onRowClick,
  className,
}) {
  if (loading) {
    return <TableLoader rows={5} columns={columns.length} />
  }

  if (!data.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border border-border/70', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm" role="table">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn('px-4 py-3 text-left font-medium text-muted-foreground', col.className)}
                  aria-sort={col.sorted ?? 'none'}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row[keyField]}
                className={cn('border-b border-border/60 last:border-0 transition-colors', onRowClick && 'cursor-pointer hover:bg-muted/30 focus-within:bg-muted/30')}
                onClick={() => onRowClick?.(row)}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={(e) => onRowClick && e.key === 'Enter' && onRowClick(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3', col.className)}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
