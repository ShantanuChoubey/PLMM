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
import { HUB_RESOURCE_CATEGORIES, HUB_RESOURCE_TYPES } from '@/mock/resourceCategories'

const uploadSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Select a category'),
  type: z.string().min(1, 'Select a type'),
  tags: z.string().min(2, 'Add at least one tag'),
  externalUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})

export function UploadResourceModal({ onUpload, trigger }) {
  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: { title: '', description: '', category: HUB_RESOURCE_CATEGORIES[0], type: HUB_RESOURCE_TYPES[0], tags: '', externalUrl: '' },
  })

  const onSubmit = async (values) => {
    await new Promise((r) => setTimeout(r, 500))
    onUpload?.({
      id: `hub-${crypto.randomUUID()}`,
      ...values,
      tags: values.tags.split(',').map((t) => t.trim()).filter(Boolean),
      uploader: 'You',
      views: 0,
      downloads: 0,
      rating: 0,
      uploadedAt: new Date().toISOString().slice(0, 10),
      recentlyViewed: false,
    })
    toast.success('Resource uploaded (mock).')
    reset()
    setFileName('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button type="button">Upload Resource</Button>}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Resource</DialogTitle>
          <DialogDescription>Share learning materials with the community.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Title" error={errors.title?.message}><Input {...register('title')} /></Field>
          <Field label="Description" error={errors.description?.message}>
            <textarea {...register('description')} rows={3} className="flex w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" error={errors.category?.message}>
              <select {...register('category')} className="flex h-9 w-full rounded-md border border-input px-3 text-sm">
                {HUB_RESOURCE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Resource Type" error={errors.type?.message}>
              <select {...register('type')} className="flex h-9 w-full rounded-md border border-input px-3 text-sm">
                {HUB_RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Tags (comma-separated)" error={errors.tags?.message}>
            <Input {...register('tags')} placeholder="React, Frontend" />
          </Field>
          <Field label="File Upload (optional)" error={null}>
            <Input type="file" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} aria-label="Upload file" />
            {fileName ? <p className="text-xs text-muted-foreground">Selected: {fileName}</p> : null}
          </Field>
          <Field label="External URL (optional)" error={errors.externalUrl?.message}>
            <Input {...register('externalUrl')} placeholder="https://..." type="url" />
          </Field>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>Upload</Button>
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
