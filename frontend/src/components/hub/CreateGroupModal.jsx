import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { GROUP_CATEGORIES } from '@/mock/resourceCategories'

const createGroupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Select a category'),
  maxMembers: z.coerce.number().min(2, 'Minimum 2 members').max(100, 'Maximum 100 members'),
  tags: z.string().min(2, 'Add at least one tag'),
  visibility: z.enum(['public', 'private']),
})

export function CreateGroupModal({ onCreate, trigger }) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: '', description: '', category: GROUP_CATEGORIES[0], maxMembers: 25, tags: '', visibility: 'public' },
  })

  const onSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 500))
    onCreate?.({
      ...values,
      tags: values.tags.split(',').map((t) => t.trim()).filter(Boolean),
      id: `g-${crypto.randomUUID()}`,
      memberCount: 1,
      createdBy: 'You',
      activityLevel: 'low',
      trending: false,
      recommended: false,
      isJoined: true,
      stats: { resourcesShared: 0, sessionsConducted: 0, weeklyActivity: 10 },
    })
    toast.success('Group created (mock).')
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button type="button">Create Group</Button>}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Study Group</DialogTitle>
          <DialogDescription>Start a new community for collaborative learning.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Group Name" error={errors.name?.message}>
            <Input {...register('name')} aria-invalid={Boolean(errors.name)} />
          </Field>
          <Field label="Description" error={errors.description?.message}>
            <textarea {...register('description')} rows={3} className="flex w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring" />
          </Field>
          <Field label="Category" error={errors.category?.message}>
            <select {...register('category')} className="flex h-9 w-full rounded-md border border-input px-3 text-sm">
              {GROUP_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Max Members" error={errors.maxMembers?.message}>
            <Input type="number" {...register('maxMembers')} min={2} max={100} />
          </Field>
          <Field label="Tags (comma-separated)" error={errors.tags?.message}>
            <Input {...register('tags')} placeholder="React, JavaScript" />
          </Field>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Visibility</legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" value="public" {...register('visibility')} className="accent-foreground" />
                Public
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" value="private" {...register('visibility')} className="accent-foreground" />
                Private
              </label>
            </div>
          </fieldset>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>Create Group</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
    </div>
  )
}
