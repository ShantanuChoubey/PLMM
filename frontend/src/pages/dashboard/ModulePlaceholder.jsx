import { PageContainer } from '@/components/layout/PageContainer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ModulePlaceholder({ title, description }) {
  return (
    <PageContainer title={title} description={description}>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            This module shell is ready. Feature implementation will be added in a future sprint.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Navigation, layout, and route protection are already wired for this section.
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
