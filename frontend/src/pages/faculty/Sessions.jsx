import { PageContainer } from '@/components/layout/PageContainer'
import { SessionStatusBadge } from '@/components/shared/SessionStatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FACULTY_SESSIONS } from '@/mock/facultyData'

export default function FacultySessionsPage() {
  return (
    <PageContainer title="Sessions" description="Overview of supervised mentoring sessions and participation tracking.">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="border-border/70"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Sessions</p><p className="text-2xl font-semibold">{FACULTY_SESSIONS.length}</p></CardContent></Card>
        <Card className="border-border/70"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Avg Participation</p><p className="text-2xl font-semibold">{Math.round(FACULTY_SESSIONS.reduce((a, s) => a + s.participation, 0) / FACULTY_SESSIONS.length)}%</p></CardContent></Card>
        <Card className="border-border/70"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-semibold">{FACULTY_SESSIONS.filter((s) => s.status === 'in_progress' || s.status === 'scheduled').length}</p></CardContent></Card>
      </div>
      <div className="space-y-4">
        {FACULTY_SESSIONS.map((session) => (
          <Card key={session.id} className="border-border/70">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-base">{session.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{session.date}</p>
              </div>
              <SessionStatusBadge status={session.status} />
            </CardHeader>
            <CardContent className="grid gap-2 text-sm sm:grid-cols-3">
              <div><span className="text-muted-foreground">Mentor:</span> {session.mentor}</div>
              <div><span className="text-muted-foreground">Students:</span> {session.students}</div>
              <div><span className="text-muted-foreground">Participation:</span> {session.participation}%</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
