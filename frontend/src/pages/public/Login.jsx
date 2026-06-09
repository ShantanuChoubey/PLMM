import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Container } from '@/components/common/Container'
import { getRoleHomeRoute } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { showAuthSuccess } from '@/utils/authErrors'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values) => {
    try {
      const user = await login(values)
      showAuthSuccess(`Welcome back, ${user.name}!`)
      const redirectTo = location.state?.from || getRoleHomeRoute(user.role)
      navigate(redirectTo, { replace: true })
    } catch {
      // Errors are handled in AuthContext
    }
  }

  return (
    <Container className="flex min-h-[calc(100vh-8rem)] items-center py-12">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your PLMM account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@university.edu"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
                {errors.email ? (
                  <p id="email-error" className="text-sm text-destructive" role="alert">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                {errors.password ? (
                  <p id="password-error" className="text-sm text-destructive" role="alert">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              <Button type="submit" className="w-full" disabled={loading} aria-busy={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Signing in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>

              <p className="rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                Demo account: <span className="font-medium text-foreground">demo@example.com</span>{' '}
                / <span className="font-medium text-foreground">password</span>
              </p>

              <div className="flex flex-col gap-3 pt-2 text-center text-sm">
                <button
                  type="button"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() =>
                    toast('Forgot password flow will be added in a future sprint.')
                  }
                >
                  Forgot Password
                </button>
                <p className="text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link
                    to={ROUTES.REGISTER}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
