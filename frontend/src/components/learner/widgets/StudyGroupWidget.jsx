import { UsersRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { STUDY_GROUP_PREVIEW } from '@/mock/learnerData'

export function StudyGroupWidget() {
  const group = STUDY_GROUP_PREVIEW

  return (
    <Card className="border-border/70 bg-card/60">
      <CardHeader>
        <CardTitle className="text-lg">Study Group Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3 rounded-lg border border-border/60 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <UsersRound className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium">{group.name}</h3>
              <Badge variant="secondary">{group.members} members</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{group.topic}</p>
            <p className="mt-2 text-xs text-muted-foreground">Next: {group.nextSession}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Full study groups module coming in a future sprint.
        </p>
      </CardContent>
    </Card>
  )
}
