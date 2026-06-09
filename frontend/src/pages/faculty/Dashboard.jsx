import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { BookOpen, Calendar, Users, UsersRound } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { MetricCard } from '@/components/shared/MetricCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { FACULTY_DASHBOARD_METRICS, FACULTY_RECENT_ACTIVITY, FACULTY_ENGAGEMENT_CHART } from '@/mock/facultyData'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts'

export default function FacultyDashboardPage() {
  const { user } = useAuth()
  const metrics = FACULTY_DASHBOARD_METRICS
  const firstName = user?.name?.split(' ')[0] ?? 'Faculty'

  return (
    <PageContainer title="Faculty Dashboard" description="Supervise mentorship programs and monitor student engagement.">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/70 bg-gradient-to-br from-card via-card to-primary/5">
            <CardContent className="p-6 sm:p-8">
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <h2 className="text-2xl font-semibold tracking-tight">Hi {firstName}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Monitoring {metrics.groupsMonitored} study groups and {metrics.sessionsSupervised} supervised sessions.</p>
            </CardContent>
          </Card>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Sessions Supervised" value={String(metrics.sessionsSupervised)} icon={Calendar} />
          <MetricCard title="Groups Monitored" value={String(metrics.groupsMonitored)} icon={UsersRound} />
          <MetricCard title="Resources Published" value={String(metrics.resourcesPublished)} icon={BookOpen} />
          <MetricCard title="Student Engagement" value={`${metrics.studentEngagement}%`} icon={Users} trend="+3% this month" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader><CardTitle>Engagement Metrics</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={FACULTY_ENGAGEMENT_CHART}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Line type="monotone" dataKey="engagement" stroke="var(--primary)" strokeWidth={2} name="Engagement %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardHeader><CardTitle>Session Volume</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FACULTY_ENGAGEMENT_CHART}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Bar dataKey="sessions" fill="var(--primary)" name="Sessions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <Card className="border-border/70">
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {FACULTY_RECENT_ACTIVITY.map((a) => (
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
