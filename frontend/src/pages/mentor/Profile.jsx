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
import { mentorProfileSchema } from '@/pages/mentor/profileSchema'
import { MENTOR_PROFILE } from '@/mock/mentorData'

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
}

function toFormValues(p) {
  return { name: p.name, email: p.email, bio: p.bio, skills: p.skills.join(', '), experience: p.experience, education: p.education, availabilitySummary: p.availabilitySummary }
}

export default function MentorProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(MENTOR_PROFILE)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(mentorProfileSchema),
    defaultValues: toFormValues(profile),
  })

  const onSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 600))
    setProfile((c) => ({ ...c, ...values, skills: values.skills.split(',').map((s) => s.trim()).filter(Boolean) }))
    setIsEditing(false)
    toast.success('Profile updated (mock).')
  }

  return (
    <PageContainer title="Profile" description="Manage your mentor profile and expertise." actions={!isEditing ? <Button type="button" onClick={() => { reset(toFormValues(profile)); setIsEditing(true) }}><Pencil className="h-4 w-4" />Edit Profile</Button> : null}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border/70">
          <CardContent className="flex items-center gap-4 p-6">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">{getInitials(profile.name) || <User className="h-8 w-8" />}</span>
            <div><h2 className="text-xl font-semibold">{profile.name}</h2><p className="text-sm text-muted-foreground">{profile.email}</p></div>
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70">
            <CardHeader><CardTitle>Bio</CardTitle></CardHeader>
            <CardContent>
              {isEditing ? <textarea {...register('bio')} rows={4} className="flex w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring" /> : <p className="text-sm text-muted-foreground">{profile.bio}</p>}
              {errors.bio ? <p className="mt-1 text-sm text-destructive">{errors.bio.message}</p> : null}
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardHeader><CardTitle>Skills & Experience</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <Input {...register('skills')} placeholder="Comma-separated skills" />
                  <Input {...register('experience')} />
                  <Input {...register('education')} />
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">{profile.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}</div>
                  <p className="text-sm"><span className="text-muted-foreground">Experience:</span> {profile.experience}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Education:</span> {profile.education}</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardHeader><CardTitle>Availability Summary</CardTitle></CardHeader>
            <CardContent>
              {isEditing ? <Input {...register('availabilitySummary')} /> : <p className="text-sm text-muted-foreground">{profile.availabilitySummary}</p>}
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardHeader><CardTitle>Achievements</CardTitle><CardDescription>Mentoring milestones</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {profile.achievements.map((a) => (
                <div key={a.id} className="rounded-lg border border-border/60 p-3">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        {isEditing ? (
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}</Button>
            <Button type="button" variant="outline" onClick={() => { reset(toFormValues(profile)); setIsEditing(false) }}><X className="h-4 w-4" />Cancel</Button>
          </div>
        ) : null}
      </form>
    </PageContainer>
  )
}
