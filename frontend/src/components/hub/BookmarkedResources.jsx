import { HubResourceCard } from '@/components/hub/ResourceCard'
import { Card, CardContent } from '@/components/ui/card'
import { TagBadge } from '@/components/hub/TagBadge'
import { FAVORITE_CATEGORIES } from '@/mock/bookmarkedResources'

export function BookmarkedResources({ resources, bookmarkedIds, onView, onBookmark }) {
  if (!resources.length) {
    return (
      <Card className="border-border/70">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No bookmarked resources yet. Save resources to access them quickly.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Favorite Categories</h3>
        <div className="flex flex-wrap gap-2">
          {FAVORITE_CATEGORIES.map((cat) => <TagBadge key={cat} tag={cat} />)}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {resources.map((r) => (
          <HubResourceCard key={r.id} resource={r} onView={onView} isBookmarked={bookmarkedIds.includes(r.id)} onBookmark={onBookmark} />
        ))}
      </div>
    </div>
  )
}
