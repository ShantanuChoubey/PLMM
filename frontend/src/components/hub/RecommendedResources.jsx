import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TagList } from '@/components/hub/TagBadge'

export function RecommendedResources({ resources, onView, compact = false }) {
  if (compact) {
    return (
      <Card className="border-border/70 bg-card/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recommended Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {resources.slice(0, 3).map((r) => (
            <div key={r.id} className="rounded-lg border border-border/60 p-3">
              <p className="text-sm font-medium">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
        Recommended For You
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => (
          <Card key={r.id} className="border-border/70 bg-card/60 transition-shadow hover:shadow-md">
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{r.title}</CardTitle>
                <Badge className="shrink-0 bg-primary/10 text-primary hover:bg-primary/10">{r.rating}★</Badge>
              </div>
              <Badge variant="outline" className="w-fit text-xs">{r.category}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
              <p className="text-xs text-primary">{r.reason}</p>
              <TagList tags={r.tags} limit={2} />
              <Button type="button" size="sm" className="w-full" onClick={() => onView?.(r)}>View Resource</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
