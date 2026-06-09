import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { BookOpen, Calendar, Clock, Star, Users } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { MetricCard } from '@/components/shared/MetricCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MENTOR_ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import {
  MENTOR_DASHBOARD_METRICS,
  MENTOR_RECENT_ACTIVITY,
  MENTOR_ACTIVITY_CHART,
  MENTOR_SESSION_TREND,
} from '@/mock/mentorData'
import { MENTOR_SESSIONS } from '@/mock/mentorSessionData'
import { CommunityActivityWidget, GroupsManagedWidget, ResourcesSharedWidget } from '@/components/hub/widgets/MentorHubWidgets'
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

export default function MentorDashboardPage() {
  const { user } = useAuth()
  const metrics = MENTOR_DASHBOARD_METRICS
  const firstName = user?.name?.split(' ')[0] ?? 'Mentor'
  const pendingRequests = MENTOR_SESSIONS.filter((s) => s.status === 'pending')
  const upcoming = MENTOR_SESSIONS.filter((s) => s.status === 'accepted')

  return (
    <PageContainer title="Mentor Dashboard" description="Manage sessions, availability, and mentee relationships.">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-card via-card to-primary/5">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="text-sm text-muted-foreground">Welcome back</p>
                <h2 className="text-2xl font-semibold tracking-tight">Hi {firstName}, ready to mentor?</h2>
                <p className="mt-2 text-sm text-muted-foreground">You have {metrics.pendingRequests} pending session requests.</p>
              </div>
              <Button asChild><Link to={MENTOR_ROUTES.SESSIONS}>View Requests</Link></Button>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard title="Pending Requests" value={String(metrics.pendingRequests)} icon={Clock} />
          <MetricCard title="Completed Sessions" value={String(metrics.completedSessions)} icon={Calendar} />
          <MetricCard title="Average Rating" value={String(metrics.averageRating)} icon={Star} />
          <MetricCard title="Students Mentored" value={String(metrics.studentsMentored)} icon={Users} />
          <MetricCard title="Resources Shared" value={String(metrics.resourcesShared)} icon={BookOpen} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <GroupsManagedWidget />
          <ResourcesSharedWidget />
          <CommunityActivityWidget />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pending Session Requests</CardTitle>
              <Button asChild variant="ghost" size="sm"><Link to={MENTOR_ROUTES.SESSIONS}>View all</Link></Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.slice(0, 2).map((s) => (
                <div key={s.id} className="rounded-lg border border-border/60 p-3">
                  <p className="text-sm font-medium">{s.topic}</p>
                  <p className="text-xs text-muted-foreground">{s.learnerName} · {s.requestedDate}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardHeader><CardTitle className="text-lg">Upcoming Sessions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {upcoming.map((s) => (
                <div key={s.id} className="rounded-lg border border-border/60 p-3">
                  <p className="text-sm font-medium">{s.topic}</p>
                  <p className="text-xs text-muted-foreground">{s.learnerName} · {s.requestedTime}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader><CardTitle>Mentor Activity</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MENTOR_ACTIVITY_CHART}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Bar dataKey="sessions" fill="var(--primary)" name="Sessions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardHeader><CardTitle>Session Trends</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MENTOR_SESSION_TREND}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Line type="monotone" dataKey="completed" stroke="var(--primary)" strokeWidth={2} name="Completed" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/70">
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {MENTOR_RECENT_ACTIVITY.map((a) => (
                <li key={a.id} className="border-b border-border/60 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                  <time className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })}</time>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
