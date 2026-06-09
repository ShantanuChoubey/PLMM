import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TagList } from '@/components/hub/TagBadge'
import { cn } from '@/lib/utils'

const activityColors = {
  high: 'text-emerald-600 dark:text-emerald-400',
  medium: 'text-amber-600 dark:text-amber-400',
  low: 'text-muted-foreground',
}

export function GroupCard({ group, groupsBasePath, onJoin, onLeave, className }) {
  const detailUrl = `${groupsBasePath}/${group.id}`

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className={cn('h-full', className)}>
      <Card className="flex h-full flex-col border-border/70 bg-card/60 transition-shadow hover:shadow-md">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">{group.name}</CardTitle>
            {group.trending ? (
              <Badge variant="secondary" className="shrink-0 gap-1">
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                Trending
              </Badge>
            ) : null}
          </div>
          <Badge variant="outline" className="w-fit text-xs">{group.category}</Badge>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {group.memberCount}/{group.maxMembers}
            </span>
            <span className={cn('capitalize text-xs font-medium', activityColors[group.activityLevel])}>
              {group.activityLevel} activity
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Created by {group.createdBy}</p>
          <TagList tags={group.tags} limit={3} />
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={detailUrl}>View Details</Link>
          </Button>
          {group.isJoined ? (
            <Button type="button" variant="outline" className="flex-1" onClick={() => onLeave?.(group.id)}>
              Leave
            </Button>
          ) : (
            <Button type="button" className="flex-1" onClick={() => onJoin?.(group.id)}>
              Join Group
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
