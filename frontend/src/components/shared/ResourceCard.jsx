import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ResourceCard({ resource, className }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className={cn('h-full', className)}>
      <Card className="flex h-full flex-col border-border/70 bg-card/60 transition-shadow hover:shadow-md">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">{resource.title}</CardTitle>
            <Badge variant="secondary">{resource.type}</Badge>
          </div>
          <Badge variant="outline" className="w-fit">{resource.category}</Badge>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground">{resource.description}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            {format(new Date(resource.uploadedAt), 'MMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            {resource.downloads}
          </span>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
