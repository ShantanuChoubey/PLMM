import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Download, Eye, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TagList } from '@/components/hub/TagBadge'
import { cn } from '@/lib/utils'

export function HubResourceCard({ resource, onView, isBookmarked, onBookmark, className }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className={cn('h-full', className)}>
      <Card className="flex h-full flex-col border-border/70 bg-card/60 transition-shadow hover:shadow-md">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">{resource.title}</CardTitle>
            <Badge variant="secondary" className="shrink-0">{resource.type}</Badge>
          </div>
          <Badge variant="outline" className="w-fit text-xs">{resource.category}</Badge>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
          <p className="text-xs text-muted-foreground">by {resource.uploader}</p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" aria-hidden="true" />{resource.views}</span>
            <span className="flex items-center gap-1"><Download className="h-3 w-3" aria-hidden="true" />{resource.downloads}</span>
            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />{resource.rating}</span>
          </div>
          <TagList tags={resource.tags} limit={2} />
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={() => onView?.(resource)}>
            View
          </Button>
          <Button
            type="button"
            variant={isBookmarked ? 'default' : 'outline'}
            size="sm"
            onClick={() => onBookmark?.(resource.id)}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>
        </CardFooter>
        <p className="px-6 pb-4 text-[11px] text-muted-foreground">
          {format(new Date(resource.uploadedAt), 'MMM d, yyyy')}
        </p>
      </Card>
    </motion.div>
  )
}
