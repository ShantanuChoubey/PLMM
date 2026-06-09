import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageContainer } from '@/components/layout/PageContainer'
import { AchievementCard } from '@/components/learner/AchievementCard'
import { ProgressCard } from '@/components/learner/ProgressCard'
import { SkillProgressBar } from '@/components/learner/SkillProgressBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ACHIEVEMENTS,
  LEARNING_GOALS,
  MILESTONES,
  PROGRESS_SUMMARY,
  PROGRESS_TREND,
  SKILL_COMPLETION,
  SKILLS_PROGRESS,
} from '@/mock/progressData'

export default function LearnerProgressPage() {
  return (
    <PageContainer
      title="Progress"
      description="Track your skills, goals, sessions, and learning milestones."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ProgressCard title="Overall Progress" value={`${PROGRESS_SUMMARY.overallProgress}%`} subtitle="Across all goals" />
        <ProgressCard title="Completed Sessions" value={String(PROGRESS_SUMMARY.completedSessions)} subtitle="Total sessions" />
        <ProgressCard title="Active Goals" value={String(PROGRESS_SUMMARY.activeGoals)} subtitle="In progress" />
        <ProgressCard title="Achievements" value={String(PROGRESS_SUMMARY.achievementsEarned)} subtitle="Earned badges" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader><CardTitle>Progress Trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PROGRESS_TREND}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Line type="monotone" dataKey="progress" stroke="var(--primary)" strokeWidth={2} dot={false} name="Progress %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader><CardTitle>Skill Completion</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SKILL_COMPLETION} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader><CardTitle>Skills Progress</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {SKILLS_PROGRESS.map((item) => (
              <SkillProgressBar key={item.skill} skill={item.skill} progress={item.progress} />
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader><CardTitle>Learning Goals</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {LEARNING_GOALS.map((goal) => (
              <div key={goal.id}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-muted-foreground">{goal.progress}%</span>
                </div>
                <SkillProgressBar skill="" progress={goal.progress} className="[&>div:first-child]:hidden" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader><CardTitle>Milestones</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {MILESTONES.map((milestone) => (
              <div key={milestone.id}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{milestone.title}</span>
                  <span className="text-muted-foreground">{milestone.current}/{milestone.target}</span>
                </div>
                <SkillProgressBar
                  skill=""
                  progress={Math.round((milestone.current / milestone.target) * 100)}
                  className="[&>div:first-child]:hidden"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Achievements</h2>
          {ACHIEVEMENTS.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>

      <Card className="mt-6 border-border/70">
        <CardHeader><CardTitle>Learning Growth</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PROGRESS_TREND}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
              <Line type="monotone" dataKey="sessions" stroke="hsl(142 76% 36%)" strokeWidth={2} name="Sessions" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
