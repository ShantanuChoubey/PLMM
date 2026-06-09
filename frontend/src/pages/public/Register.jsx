import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Container } from '@/components/common/Container'
import { ROLE_OPTIONS } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export default function Register() {
  const navigate = useNavigate()
  const { register: registerUser, loading } = useAuth()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: ROLE_OPTIONS[0].value,
    },
  })

  const onSubmit = async (values) => {
    try {
      await registerUser(values)
      navigate(ROUTES.LOGIN, { replace: true })
    } catch {
      // Errors are handled in AuthContext
    }
  }

  return (
    <Container className="flex min-h-[calc(100vh-8rem)] items-center py-12">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Join PLMM as a learner or mentor</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />
                {errors.name ? (
                  <p id="name-error" className="text-sm text-destructive" role="alert">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>

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
                  autoComplete="new-password"
                  placeholder="Create a secure password"
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

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Role</legend>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: 'Please select a role' }}
                  render={({ field }) => (
                    <div className="grid gap-2">
                      {ROLE_OPTIONS.map((option) => (
                        <label
                          key={option.value}
                          className={cn(
                            'flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors',
                            field.value === option.value
                              ? 'border-foreground bg-accent'
                              : 'border-input hover:bg-accent/50',
                          )}
                        >
                          <input
                            type="radio"
                            value={option.value}
                            checked={field.value === option.value}
                            onChange={() => field.onChange(option.value)}
                            onBlur={field.onBlur}
                            name={field.name}
                            className="h-4 w-4 accent-foreground"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.role ? (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.role.message}
                  </p>
                ) : null}
              </fieldset>

              <Button type="submit" className="w-full" disabled={loading} aria-busy={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Creating account...
                  </>
                ) : (
                  'Register'
                )}
              </Button>

              <p className="pt-2 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
