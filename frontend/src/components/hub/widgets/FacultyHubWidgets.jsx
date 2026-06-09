import { Link } from 'react-router-dom'
import { BookOpen, UsersRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FACULTY_ROUTES } from '@/constants/routes'
import { STUDY_GROUPS, COMMUNITY_ACTIVITY_CHART } from '@/mock/groupsData'
import { HUB_RESOURCES } from '@/mock/resourceData'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

export function GroupsMonitoredWidget() {
  const monitored = STUDY_GROUPS.slice(0, 4)

  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Groups Monitored</CardTitle>
        <Button asChild variant="ghost" size="sm"><Link to={FACULTY_ROUTES.GROUPS}>View all</Link></Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {monitored.map((g) => (
          <div key={g.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <UsersRound className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
              <span className="font-medium truncate">{g.name}</span>
            </div>
            <span className="text-xs text-muted-foreground shrink-0 ml-2">{g.memberCount} members</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function EducationalResourcesPublishedWidget() {
  const published = HUB_RESOURCES.slice(0, 4)

  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Educational Resources Published</CardTitle>
        <Button asChild variant="ghost" size="sm"><Link to={FACULTY_ROUTES.RESOURCES}>Hub</Link></Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {published.map((r) => (
          <div key={r.id} className="flex items-start gap-2 rounded-lg border border-border/60 p-3">
            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.category} · {r.views} views</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function CommunityInsightsWidget() {
  const chartData = COMMUNITY_ACTIVITY_CHART.map((d) => ({
    week: d.week,
    activity: d.posts + d.resources + d.sessions,
  }))

  return (
    <Card className="border-border/70">
      <CardHeader><CardTitle className="text-lg">Community Insights</CardTitle></CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
              <Line type="monotone" dataKey="activity" stroke="var(--primary)" strokeWidth={2} name="Total Activity" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Combined posts, resources, and sessions across monitored study groups.
        </p>
      </CardContent>
    </Card>
  )
}
