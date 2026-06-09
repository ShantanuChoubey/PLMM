import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/common/Container'
import { ROUTES } from '@/constants/routes'

export default function NotFound() {
  return (
    <Container className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button asChild className="mt-8">
        <Link to={ROUTES.HOME}>Back to Home</Link>
      </Button>
    </Container>
  )
}
