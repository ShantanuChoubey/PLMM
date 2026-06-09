import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Users,
  UsersRound,
} from 'lucide-react'
import { ChartCard } from '@/components/admin/ChartCard'
import { MetricCard } from '@/components/admin/MetricCard'
import { SystemStatusCard } from '@/components/admin/SystemStatusCard'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ADMIN_ROUTES } from '@/constants/routes'
import { AnalyticsSkeleton } from '@/components/common/skeletons/AppSkeletons'
import { QueryErrorState } from '@/components/common/QueryErrorState'
import { useAdminDashboardAnalytics } from '@/hooks/api/useAnalytics'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useAdminDashboardAnalytics()
  const dashboard = data?.data ?? {}
  const kpis = dashboard.kpis ?? {}
  const platformOverview = dashboard.overview ?? {}
  const growthMetrics = dashboard.growthMetrics ?? []
  const recentActivity = dashboard.recentActivity ?? []
  const topMentors = dashboard.topMentors ?? []
  const popularGroups = dashboard.popularGroups ?? []
  const recentResources = dashboard.recentResources ?? []
  const charts = dashboard.charts ?? {}

  if (isLoading) {
    return (
      <PageContainer title="Admin Dashboard" description="Monitor platform health, users, and mentorship operations.">
        <AnalyticsSkeleton />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer title="Admin Dashboard" description="Monitor platform health, users, and mentorship operations.">
        <QueryErrorState error={error} onRetry={refetch} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Admin Dashboard"
      description="Monitor platform health, users, and mentorship operations."
      actions={
        <Button asChild variant="outline">
          <Link to={ADMIN_ROUTES.ANALYTICS}>View Analytics</Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total Users" value={kpis.totalUsers.toLocaleString()} icon={Users} trend="+8.4%" />
          <MetricCard title="Active Learners" value={kpis.activeLearners.toLocaleString()} icon={GraduationCap} trend="+6.2%" />
          <MetricCard title="Active Mentors" value={String(kpis.activeMentors)} icon={UsersRound} trend="+12" />
          <MetricCard title="Faculty Mentors" value={String(kpis.facultyMentors)} icon={Users} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total Sessions" value={String(kpis.totalSessions)} icon={Calendar} trend="+18%" />
          <MetricCard title="Completed Sessions" value={String(kpis.completedSessions)} icon={Calendar} description="84% completion rate" />
          <MetricCard title="Active Groups" value={String(kpis.activeGroups)} icon={UsersRound} trend="+4" />
          <MetricCard title="Resources Uploaded" value={String(kpis.resourcesUploaded)} icon={BookOpen} trend="+12%" />
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-4">
          <Card className="border-border/70 lg:col-span-1">
            <CardHeader><CardTitle className="text-base">Platform Overview</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Weekly Active Users</span><span className="font-medium">{platformOverview.weeklyActiveUsers}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Session Completion</span><span className="font-medium">{platformOverview.sessionCompletionRate}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Mentor Satisfaction</span><span className="font-medium">{platformOverview.mentorSatisfaction}/5</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Resource Engagement</span><span className="font-medium">{platformOverview.resourceEngagement}%</span></div>
            </CardContent>
          </Card>
          <Card className="border-border/70 lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Growth Metrics</CardTitle></CardHeader>
            <CardContent className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthMetrics}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Area type="monotone" dataKey="users" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} name="Users" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <SystemStatusCard />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="User Growth">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.userGrowth ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Line type="monotone" dataKey="learners" stroke="var(--primary)" strokeWidth={2} name="Learners" />
                <Line type="monotone" dataKey="mentors" stroke="hsl(142 76% 36%)" strokeWidth={2} name="Mentors" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Session Trends">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.sessionTrends ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Bar dataKey="completed" fill="var(--primary)" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="hsl(45 93% 47%)" name="Pending" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ChartCard title="Mentor Engagement" contentClassName="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.mentorEngagement ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Line type="monotone" dataKey="sessions" stroke="var(--primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Group Activity" contentClassName="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.groupActivity ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Bar dataKey="members" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Resource Usage" contentClassName="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.resourceUsage ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Area type="monotone" dataKey="views" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button asChild variant="ghost" size="sm"><Link to={ADMIN_ROUTES.AUDIT_LOGS}>Audit logs</Link></Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivity.map((a) => (
                  <li key={a.id} className="border-b border-border/60 pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                    <time className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })}</time>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardHeader><CardTitle>Top Mentors</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {topMentors.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.expertise} · {m.sessions} sessions</p>
                  </div>
                  <span className="text-sm font-medium text-amber-500">{m.rating}★</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader><CardTitle>Popular Groups</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {popularGroups.map((g) => (
                <div key={g.id} className="flex justify-between rounded-lg border border-border/60 p-3 text-sm">
                  <div>
                    <p className="font-medium">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.category} · {g.members} members</p>
                  </div>
                  <span className="text-xs font-medium text-emerald-500">{g.activityScore}% active</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardHeader><CardTitle>Recent Resources</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {recentResources.map((r) => (
                <div key={r.id} className="flex justify-between rounded-lg border border-border/60 p-3 text-sm">
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.type} · {r.uploader}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.views} views</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
