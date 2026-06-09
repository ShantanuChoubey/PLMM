import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, MessageSquare } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { ActivityFeed } from '@/components/hub/ActivityFeed'
import { GroupStatsCard } from '@/components/hub/GroupStatsCard'
import { TagList } from '@/components/hub/TagBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getGroupActivity } from '@/mock/groupActivityData'
import { getGroupMembers } from '@/mock/groupMembersData'
import { getGroupById } from '@/mock/groupsData'
import { HUB_RESOURCES } from '@/mock/resourceData'

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
}

export default function GroupDetailsPage({ groupsBasePath }) {
  const { groupId } = useParams()
  const group = getGroupById(groupId)
  const members = getGroupMembers(groupId)
  const activity = getGroupActivity(groupId)
  const sharedResources = HUB_RESOURCES.slice(0, 3)

  if (!group) {
    return (
      <PageContainer title="Group Not Found">
        <Button asChild variant="outline"><Link to={groupsBasePath}><ArrowLeft className="h-4 w-4" />Back to Groups</Link></Button>
      </PageContainer>
    )
  }

  const upcomingSessions = [
    { title: 'Weekly Study Session', date: 'Thursday, 4:00 PM' },
    { title: 'Q&A with Mentor', date: 'Saturday, 10:00 AM' },
  ]

  const discussions = [
    { author: 'Alex Parker', preview: 'Can someone explain useEffect cleanup patterns?', time: '2h ago' },
    { author: 'Jamie Lee', preview: 'Sharing my notes from last session...', time: '1d ago' },
  ]

  return (
    <PageContainer title={group.name} description={group.category}>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to={groupsBasePath}><ArrowLeft className="h-4 w-4" />Back to Groups</Link>
      </Button>

      <Card className="mb-6 border-border/70">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{group.category}</Badge>
                <Badge variant="outline" className="capitalize">{group.visibility}</Badge>
                <Badge variant="outline" className="capitalize">{group.activityLevel} activity</Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">{group.description}</p>
              <TagList tags={group.tags} className="mt-3" />
            </div>
            <Button type="button">{group.isJoined ? 'Leave Group' : 'Join Group'}</Button>
          </div>
        </CardContent>
      </Card>

      <GroupStatsCard stats={{ ...group.stats, memberCount: group.memberCount }} className="mb-6" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader><CardTitle>Members ({members.length})</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{getInitials(m.name)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role} · Joined {m.joinedAt}</p>
                  </div>
                  <Badge variant={m.status === 'active' ? 'secondary' : 'outline'} className="capitalize shrink-0">{m.status}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <ActivityFeed activities={activity} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="border-border/70">
          <CardHeader><CardTitle>Shared Resources</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {sharedResources.map((r) => (
              <div key={r.id} className="rounded-lg border border-border/60 p-3">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.type} · {r.uploader}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-4 w-4" />Upcoming Sessions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {upcomingSessions.map((s) => (
              <div key={s.title} className="rounded-lg border border-border/60 p-3">
                <p className="text-sm font-medium">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-4 w-4" />Discussion Preview</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {discussions.map((d) => (
              <div key={d.author} className="rounded-lg border border-border/60 p-3">
                <p className="text-sm font-medium">{d.author}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{d.preview}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{d.time}</p>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-2">Full chat coming in a future sprint.</p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
