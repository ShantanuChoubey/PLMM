import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Loader2, Pencil, User, X } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { learnerProfileSchema } from '@/pages/learner/profileSchema'
import { LEARNER_PROFILE } from '@/mock/learnerData'

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function profileToFormValues(profile) {
  return {
    name: profile.name,
    email: profile.email,
    bio: profile.bio,
    university: profile.university,
    department: profile.department,
    year: profile.year,
    gpa: profile.gpa ?? '',
    learningGoals: profile.learningGoals.join('\n'),
    skillsNeeded: profile.skillsNeeded.join(', '),
    availabilityDays: profile.availability.days.join(', '),
    availabilityTime: profile.availability.timeRange,
    timezone: profile.availability.timezone,
  }
}

export default function LearnerProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(LEARNER_PROFILE)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(learnerProfileSchema),
    defaultValues: profileToFormValues(profile),
  })

  const onSubmit = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    setProfile((current) => ({
      ...current,
      name: values.name,
      email: values.email,
      bio: values.bio,
      university: values.university,
      department: values.department,
      year: values.year,
      gpa: values.gpa,
      learningGoals: values.learningGoals.split('\n').filter(Boolean),
      skillsNeeded: values.skillsNeeded.split(',').map((s) => s.trim()).filter(Boolean),
      availability: {
        days: values.availabilityDays.split(',').map((s) => s.trim()).filter(Boolean),
        timeRange: values.availabilityTime,
        timezone: values.timezone,
      },
    }))
    setIsEditing(false)
    toast.success('Profile updated successfully (mock).')
  }

  const handleCancel = () => {
    reset(profileToFormValues(profile))
    setIsEditing(false)
  }

  const startEditing = () => {
    reset(profileToFormValues(profile))
    setIsEditing(true)
  }

  return (
    <PageContainer
      title="Profile"
      description="Manage your personal, academic, and learning information."
      actions={
        !isEditing ? (
          <Button type="button" onClick={startEditing}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit Profile
          </Button>
        ) : null
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border/70">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              {getInitials(profile.name) || <User className="h-8 w-8" />}
            </span>
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">{profile.department}</Badge>
                <Badge variant="outline">{profile.year}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Name" error={errors.name?.message}>
                <Input {...register('name')} readOnly={!isEditing} aria-readonly={!isEditing} />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <Input type="email" {...register('email')} readOnly={!isEditing} aria-readonly={!isEditing} />
              </Field>
              <Field label="Bio" error={errors.bio?.message}>
                <textarea
                  {...register('bio')}
                  readOnly={!isEditing}
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
                />
              </Field>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>Your university and program details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="University" error={errors.university?.message}>
                <Input {...register('university')} readOnly={!isEditing} />
              </Field>
              <Field label="Department" error={errors.department?.message}>
                <Input {...register('department')} readOnly={!isEditing} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Year" error={errors.year?.message}>
                  <Input {...register('year')} readOnly={!isEditing} />
                </Field>
                <Field label="GPA" error={errors.gpa?.message}>
                  <Input {...register('gpa')} readOnly={!isEditing} />
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Learning Goals</CardTitle>
              <CardDescription>One goal per line</CardDescription>
            </CardHeader>
            <CardContent>
              <Field label="Goals" error={errors.learningGoals?.message}>
                <textarea
                  {...register('learningGoals')}
                  readOnly={!isEditing}
                  rows={5}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </Field>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Skills Needed</CardTitle>
              <CardDescription>Comma-separated list</CardDescription>
            </CardHeader>
            <CardContent>
              <Field label="Skills" error={errors.skillsNeeded?.message}>
                <Input {...register('skillsNeeded')} readOnly={!isEditing} />
              </Field>
              {!isEditing ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.skillsNeeded.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-border/70 lg:col-span-2">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>When you are available for mentoring sessions</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <Field label="Days" error={errors.availabilityDays?.message}>
                <Input {...register('availabilityDays')} readOnly={!isEditing} placeholder="Mon, Wed, Fri" />
              </Field>
              <Field label="Time Range" error={errors.availabilityTime?.message}>
                <Input {...register('availabilityTime')} readOnly={!isEditing} />
              </Field>
              <Field label="Timezone" error={errors.timezone?.message}>
                <Input {...register('timezone')} readOnly={!isEditing} />
              </Field>
            </CardContent>
          </Card>
        </div>

        {isEditing ? (
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4" aria-hidden="true" />
              Cancel
            </Button>
          </div>
        ) : null}
      </form>
    </PageContainer>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">{error}</p>
      ) : null}
    </div>
  )
}
