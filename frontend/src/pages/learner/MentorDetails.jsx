import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { QueryErrorState } from '@/components/common/QueryErrorState'
import { SectionLoader } from '@/components/common/SectionLoader'
import { MentorCard } from '@/components/common/MentorCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LEARNER_ROUTES } from '@/constants/routes'
import { useMentor } from '@/hooks/api/useMentors'

export default function LearnerMentorDetailsPage() {
  const { id } = useParams()
  const { data, isLoading, isError, error, refetch } = useMentor(id)
  const mentor = data?.data

  if (isLoading) {
    return (
      <PageContainer title="Mentor Details">
        <SectionLoader label="Loading mentor profile..." />
      </PageContainer>
    )
  }

  if (isError || !mentor) {
    return (
      <PageContainer title="Mentor Not Found">
        <QueryErrorState error={error} onRetry={refetch} />
        <Button asChild variant="outline" className="mt-4">
          <Link to={LEARNER_ROUTES.MENTORS}><ArrowLeft className="h-4 w-4" />Back to Mentors</Link>
        </Button>
      </PageContainer>
    )
  }

  return (
    <PageContainer title={mentor.name} description={mentor.department}>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link to={LEARNER_ROUTES.MENTORS}><ArrowLeft className="h-4 w-4" />Back to Mentors</Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <MentorCard mentor={mentor} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/70">
            <CardHeader><CardTitle>About</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{mentor.bio}</p>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardHeader><CardTitle>Expertise</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mentor.skills.map((skill) => (
                  <span key={skill} className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">{skill}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
