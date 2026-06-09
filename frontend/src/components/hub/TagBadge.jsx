import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function TagBadge({ tag, className, onClick }) {
  return (
    <Badge
      variant="secondary"
      className={cn('text-xs', onClick && 'cursor-pointer hover:bg-secondary/80', className)}
      onClick={onClick}
    >
      {tag}
    </Badge>
  )
}

export function TagList({ tags, className, limit }) {
  const display = limit ? tags.slice(0, limit) : tags
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {display.map((tag) => (
        <TagBadge key={tag} tag={tag} />
      ))}
      {limit && tags.length > limit ? (
        <Badge variant="outline" className="text-xs">+{tags.length - limit}</Badge>
      ) : null}
    </div>
  )
}
