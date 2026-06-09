import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/common/Logo'
import { SidebarNav } from '@/components/layout/Sidebar'
import { useSidebar } from '@/hooks/useSidebar'

export function MobileSidebar() {
  const { mobileOpen, closeMobile } = useSidebar()

  useEffect(() => {
    if (!mobileOpen) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeMobile()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [mobileOpen, closeMobile])

  return (
    <AnimatePresence>
      {mobileOpen ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
            aria-label="Close navigation menu"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-border bg-background shadow-xl lg:hidden"
            aria-label="Mobile sidebar"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex h-16 items-center justify-between border-b border-border/60 px-4">
              <Logo />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={closeMobile}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
            <SidebarNav collapsed={false} onNavigate={closeMobile} />
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
