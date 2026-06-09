import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { UsersRound } from 'lucide-react'
import { RecommendedResources } from '@/components/hub/RecommendedResources'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LEARNER_ROUTES } from '@/constants/routes'
import { RECENT_GROUP_ACTIVITY } from '@/mock/groupActivityData'
import { STUDY_GROUPS } from '@/mock/groupsData'
import { RECOMMENDED_HUB_RESOURCES } from '@/mock/recommendedResources'

const typeLabels = {
  joined: 'Member joined',
  resource: 'Resource shared',
  session: 'Session scheduled',
  update: 'Group update',
}

export function MyGroupsWidget() {
  const myGroups = STUDY_GROUPS.filter((g) => g.isJoined).slice(0, 3)

  return (
    <Card className="border-border/70 bg-card/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">My Groups</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to={LEARNER_ROUTES.GROUPS}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {myGroups.map((group) => (
          <Link
            key={group.id}
            to={`${LEARNER_ROUTES.GROUPS}/${group.id}`}
            className="flex items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <UsersRound className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{group.name}</p>
                <Badge variant="secondary" className="text-xs">{group.memberCount} members</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{group.category}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

export function RecommendedResourcesWidget() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recommended Resources</h3>
        <Button asChild variant="ghost" size="sm">
          <Link to={LEARNER_ROUTES.RESOURCES}>Browse hub</Link>
        </Button>
      </div>
      <RecommendedResources resources={RECOMMENDED_HUB_RESOURCES} compact />
    </div>
  )
}

export function RecentGroupActivityWidget() {
  return (
    <Card className="border-border/70 bg-card/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">Recent Group Activity</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to={LEARNER_ROUTES.GROUPS}>Groups</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {RECENT_GROUP_ACTIVITY.map((item) => (
            <li key={item.id} className="border-b border-border/60 pb-4 last:border-0 last:pb-0">
              <p className="text-sm font-medium">{item.group}</p>
              <p className="text-sm text-muted-foreground">{item.message}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">{typeLabels[item.type]}</Badge>
                <time className="text-xs text-muted-foreground" dateTime={item.timestamp}>
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </time>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
