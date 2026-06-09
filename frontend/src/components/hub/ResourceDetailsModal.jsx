import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { Download, Flag, Share2, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TagList } from '@/components/hub/TagBadge'

export function ResourceDetailsModal({ resource, open, onOpenChange, isBookmarked, onBookmark }) {
  if (!resource) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{resource.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{resource.type}</Badge>
            <Badge variant="outline">{resource.category}</Badge>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">Preview area — {resource.type} content would render here.</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{resource.description}</p>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <p><span className="text-muted-foreground">Uploader:</span> {resource.uploader}</p>
            <p><span className="text-muted-foreground">Uploaded:</span> {format(new Date(resource.uploadedAt), 'MMM d, yyyy')}</p>
            <p className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />{resource.rating} rating</p>
            <p><span className="text-muted-foreground">Views:</span> {resource.views} · <span className="text-muted-foreground">Downloads:</span> {resource.downloads}</p>
          </div>
          <TagList tags={resource.tags} />
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="button" onClick={() => toast.success('Download started (mock).')}>
              <Download className="h-4 w-4" aria-hidden="true" />Download
            </Button>
            <Button type="button" variant="outline" onClick={() => onBookmark?.(resource.id)}>
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
            <Button type="button" variant="outline" onClick={() => toast.success('Link copied (mock).')}>
              <Share2 className="h-4 w-4" aria-hidden="true" />Share
            </Button>
            <Button type="button" variant="outline" onClick={() => toast('Report submitted (mock).')}>
              <Flag className="h-4 w-4" aria-hidden="true" />Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
