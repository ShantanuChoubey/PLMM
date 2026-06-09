import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ExportButton({ label = 'Export', onExport }) {
  const handleClick = () => {
    toast.success(`${label} export started (mock).`)
    onExport?.()
  }

  return (
    <Button type="button" variant="outline" onClick={handleClick} aria-label={`Export ${label}`}>
      <Download className="h-4 w-4" aria-hidden="true" />
      {label}
    </Button>
  )
}
