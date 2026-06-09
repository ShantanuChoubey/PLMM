import { Container } from '@/components/common/Container'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getRoleLabel } from '@/constants/roles'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedAreaPlaceholder({ area, allowedRoles }) {
  const { user } = useAuth()

  return (
    <Container className="py-16 sm:py-20">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <Badge variant="secondary" className="mb-2 w-fit">
            Protected Route
          </Badge>
          <CardTitle>{area} area</CardTitle>
          <CardDescription>
            Authentication architecture is active. Dashboard features will be added in a future
            sprint.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Signed in as <span className="font-medium text-foreground">{user?.name}</span>
          </p>
          <p>
            Role: <span className="font-medium text-foreground">{getRoleLabel(user?.role)}</span>
          </p>
          <p>Allowed roles for this route: {allowedRoles.map(getRoleLabel).join(', ')}</p>
        </CardContent>
      </Card>
    </Container>
  )
}
