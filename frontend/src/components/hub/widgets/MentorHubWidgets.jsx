import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { BookOpen, UsersRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MENTOR_ROUTES } from '@/constants/routes'
import { RECENT_GROUP_ACTIVITY } from '@/mock/groupActivityData'
import { STUDY_GROUPS } from '@/mock/groupsData'
import { HUB_RESOURCES } from '@/mock/resourceData'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { COMMUNITY_ACTIVITY_CHART } from '@/mock/groupsData'

export function GroupsManagedWidget() {
  const managed = STUDY_GROUPS.filter((g) => g.createdBy === 'Sarah Chen' || g.isJoined).slice(0, 3)

  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Groups Managed</CardTitle>
        <Button asChild variant="ghost" size="sm"><Link to={MENTOR_ROUTES.GROUPS}>View all</Link></Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {managed.map((g) => (
          <div key={g.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
            <UsersRound className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{g.name}</p>
              <p className="text-xs text-muted-foreground">{g.memberCount} members · {g.category}</p>
            </div>
            <Badge variant="outline" className="capitalize shrink-0">{g.activityLevel}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ResourcesSharedWidget() {
  const shared = HUB_RESOURCES.filter((r) => r.uploader === 'Sarah Chen').slice(0, 3)

  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Resources Shared</CardTitle>
        <Button asChild variant="ghost" size="sm"><Link to={MENTOR_ROUTES.RESOURCES}>Hub</Link></Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {shared.map((r) => (
          <div key={r.id} className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.type} · {r.downloads} downloads</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function CommunityActivityWidget() {
  return (
    <Card className="border-border/70">
      <CardHeader><CardTitle className="text-lg">Community Activity</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={COMMUNITY_ACTIVITY_CHART.slice(-4)}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
              <Bar dataKey="resources" fill="var(--primary)" name="Resources" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-2">
          {RECENT_GROUP_ACTIVITY.slice(0, 2).map((a) => (
            <li key={a.id} className="text-sm">
              <span className="font-medium">{a.group}</span>
              <span className="text-muted-foreground"> — {a.message}</span>
              <time className="block text-xs text-muted-foreground">{formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })}</time>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
