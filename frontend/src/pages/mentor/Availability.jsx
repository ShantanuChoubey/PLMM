import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { AvailabilityCalendar } from '@/components/mentor/AvailabilityCalendar'
import { AvailabilityForm } from '@/components/mentor/AvailabilityForm'
import { AvailabilitySlotCard } from '@/components/mentor/AvailabilitySlotCard'
import { MetricCard } from '@/components/shared/MetricCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AVAILABILITY_SUMMARY, INITIAL_AVAILABILITY_SLOTS } from '@/mock/availabilityData'
import { Clock } from 'lucide-react'

function formatLabel(start, end) {
  const fmt = (t) => { const [h, m] = t.split(':').map(Number); const p = h >= 12 ? 'PM' : 'AM'; return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${p}` }
  return `${fmt(start)} - ${fmt(end)}`
}

export default function MentorAvailabilityPage() {
  const [slots, setSlots] = useState(INITIAL_AVAILABILITY_SLOTS)
  const [editingSlot, setEditingSlot] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const handleAdd = (values) => {
    const slot = { id: `slot-${Date.now()}`, day: values.day, startTime: values.startTime, endTime: values.endTime, label: formatLabel(values.startTime, values.endTime) }
    setSlots((c) => [...c, slot])
    setShowAdd(false)
    toast.success('Slot added (mock).')
  }

  const handleEdit = (values) => {
    setSlots((c) => c.map((s) => s.id === editingSlot.id ? { ...s, ...values, label: formatLabel(values.startTime, values.endTime) } : s))
    setEditingSlot(null)
    toast.success('Slot updated (mock).')
  }

  const handleDelete = (id) => {
    setSlots((c) => c.filter((s) => s.id !== id))
    toast.success('Slot deleted (mock).')
  }

  return (
    <PageContainer title="Availability" description="Manage your weekly mentoring availability.">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard title="Total Slots" value={String(slots.length)} icon={Clock} />
        <MetricCard title="Weekly Hours" value={`${slots.length}h`} description={AVAILABILITY_SUMMARY.timezone} />
        <MetricCard title="Next Available" value={AVAILABILITY_SUMMARY.nextAvailable} description="Upcoming open slot" />
      </div>
      <div className="mb-6 flex justify-end">
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button type="button"><Plus className="h-4 w-4" />Add Slot</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Add Availability Slot</DialogTitle></DialogHeader><AvailabilityForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} submitLabel="Add Slot" /></DialogContent>
        </Dialog>
      </div>
      <AvailabilityCalendar slots={slots} className="mb-6" />
      <Card className="border-border/70">
        <CardHeader><CardTitle>Your Slots</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <AvailabilitySlotCard key={slot.id} slot={slot} onEdit={setEditingSlot} onDelete={handleDelete} />
          ))}
        </CardContent>
      </Card>
      {editingSlot ? (
        <Dialog open={Boolean(editingSlot)} onOpenChange={() => setEditingSlot(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Slot</DialogTitle></DialogHeader>
            <AvailabilityForm defaultValues={{ day: editingSlot.day, startTime: editingSlot.startTime, endTime: editingSlot.endTime }} onSubmit={handleEdit} onCancel={() => setEditingSlot(null)} submitLabel="Update Slot" />
          </DialogContent>
        </Dialog>
      ) : null}
    </PageContainer>
  )
}
