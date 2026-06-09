import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { RESOURCE_CATEGORIES, RESOURCE_TYPES } from '@/mock/resourceData'

export function UploadResourceModal({ onUpload, trigger }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState(RESOURCE_TYPES[0])
  const [category, setCategory] = useState(RESOURCE_CATEGORIES[0])
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onUpload?.({ title, type, category, description })
    toast.success('Resource uploaded (mock).')
    setOpen(false)
    setTitle('')
    setDescription('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button type="button">Upload Resource</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Resource</DialogTitle>
          <DialogDescription>Share learning materials with your mentees.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="upload-title" className="text-sm font-medium">Title</label>
            <Input id="upload-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="upload-type" className="text-sm font-medium">Type</label>
              <select id="upload-type" value={type} onChange={(e) => setType(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="upload-category" className="text-sm font-medium">Category</label>
              <select id="upload-category" value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                {RESOURCE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="upload-desc" className="text-sm font-medium">Description</label>
            <textarea id="upload-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Upload</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
