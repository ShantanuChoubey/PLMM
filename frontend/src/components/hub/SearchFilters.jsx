import { useState } from 'react'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function SearchFilters({ search, onSearchChange, children, className }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={cn('border-border/70', className)}>
      <CardContent className="space-y-4 p-4">
        <div className="flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="flex h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Search"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse filters' : 'Expand filters'}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
        <div className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-4', !expanded && 'hidden lg:grid')}>
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
