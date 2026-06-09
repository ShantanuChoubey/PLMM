import { User } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FACULTY_PROFILE } from '@/mock/facultyData'

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
}

export default function FacultyProfilePage() {
  const profile = FACULTY_PROFILE

  return (
    <PageContainer title="Profile" description="Your faculty mentor profile and expertise.">
      <Card className="mb-6 border-border/70">
        <CardContent className="flex items-center gap-4 p-6">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">{getInitials(profile.name) || <User className="h-8 w-8" />}</span>
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.designation}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader><CardTitle>Department</CardTitle></CardHeader>
          <CardContent><Badge variant="secondary">{profile.department}</Badge></CardContent>
        </Card>
        <Card className="border-border/70">
          <CardHeader><CardTitle>Expertise</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {profile.expertise.map((e) => <Badge key={e} variant="outline">{e}</Badge>)}
          </CardContent>
        </Card>
        <Card className="border-border/70 lg:col-span-2">
          <CardHeader><CardTitle>Bio</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p></CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
