import { AnalyticsCard } from '@/components/admin/AnalyticsCard'
import { ChartCard } from '@/components/admin/ChartCard'
import { ExportButton } from '@/components/admin/ExportButton'
import { PlatformHeatmap } from '@/components/admin/PlatformHeatmap'
import { TrendCard } from '@/components/admin/TrendCard'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ANALYTICS_SUMMARY,
  GROUP_ACTIVITY_CHART,
  MENTOR_ENGAGEMENT_CHART,
  PLATFORM_HEALTH,
  RESOURCE_USAGE_CHART,
  SESSION_TRENDS_CHART,
  USER_GROWTH_CHART,
} from '@/mock/analyticsData'
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

export default function AdminAnalyticsPage() {
  const summary = ANALYTICS_SUMMARY
  const health = PLATFORM_HEALTH

  return (
    <PageContainer title="Analytics" description="Platform-wide analytics and health metrics." actions={<ExportButton label="Export Analytics" />}>
      <div className="space-y-6">
        <section aria-labelledby="platform-health">
          <h2 id="platform-health" className="mb-4 text-lg font-semibold">Platform Health Metrics</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnalyticsCard title="Uptime" value={`${health.uptime}%`} change="+0.1%" />
            <AnalyticsCard title="Avg Response" value={`${health.avgResponseTime}ms`} change="-12ms" />
            <AnalyticsCard title="Error Rate" value={`${health.errorRate}%`} change="-0.02%" />
            <AnalyticsCard title="Active Connections" value={String(health.activeConnections)} change="+18" />
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TrendCard title="User Retention" value={`${summary.userRetention}%`} trend="+4%" />
          <TrendCard title="Mentor Utilization" value={`${summary.mentorUtilization}%`} trend="+6%" />
          <TrendCard title="Session Completion" value={`${summary.sessionCompletionRate}%`} trend="+2%" />
          <TrendCard title="Resource Engagement" value={`${summary.resourceEngagement}%`} trend="+8%" />
          <TrendCard title="Group Participation" value={`${summary.groupParticipation}%`} trend="+5%" />
          <TrendCard title="Platform Growth" value={`${summary.platformGrowth}%`} trend="+3.2%" />
        </div>

        <section aria-labelledby="user-analytics">
          <h2 id="user-analytics" className="mb-4 text-lg font-semibold">User Analytics</h2>
          <ChartCard title="User Growth" description="Learners, mentors, and faculty over time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={USER_GROWTH_CHART}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Line type="monotone" dataKey="learners" stroke="var(--primary)" strokeWidth={2} name="Learners" />
                <Line type="monotone" dataKey="mentors" stroke="hsl(142 76% 36%)" strokeWidth={2} name="Mentors" />
                <Line type="monotone" dataKey="faculty" stroke="hsl(262 83% 58%)" strokeWidth={2} name="Faculty" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <section aria-labelledby="mentor-analytics" className="grid gap-6 lg:grid-cols-2">
          <h2 id="mentor-analytics" className="sr-only">Mentor and Session Analytics</h2>
          <ChartCard title="Mentor Engagement">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MENTOR_ENGAGEMENT_CHART}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Bar dataKey="sessions" fill="var(--primary)" name="Sessions" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reviews" fill="hsl(142 76% 36%)" name="Reviews" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Session Analytics">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SESSION_TRENDS_CHART}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} name="Completed" />
                <Area type="monotone" dataKey="cancelled" stackId="1" stroke="hsl(0 84% 60%)" fill="hsl(0 84% 60%)" fillOpacity={0.2} name="Cancelled" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <section aria-labelledby="group-resource-analytics" className="grid gap-6 lg:grid-cols-2">
          <h2 id="group-resource-analytics" className="sr-only">Group and Resource Analytics</h2>
          <ChartCard title="Group Analytics">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={GROUP_ACTIVITY_CHART}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="var(--primary)" strokeWidth={2} name="Active Groups" />
                <Line type="monotone" dataKey="members" stroke="hsl(142 76% 36%)" strokeWidth={2} name="Total Members" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Resource Analytics">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RESOURCE_USAGE_CHART}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Legend />
                <Bar dataKey="uploads" fill="var(--primary)" name="Uploads" radius={[4, 4, 0, 0]} />
                <Bar dataKey="downloads" fill="hsl(142 76% 36%)" name="Downloads" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <PlatformHeatmap />

        <Card className="border-border/70">
          <CardHeader><CardTitle>Analytics Summary</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {Object.entries(summary).map(([key, value]) => (
              <div key={key} className="flex justify-between rounded-lg border border-border/60 p-3">
                <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-medium">{typeof value === 'number' && key !== 'platformGrowth' ? `${value}%` : `${value}%`}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
