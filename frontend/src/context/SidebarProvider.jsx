import { useCallback, useMemo, useState } from 'react'
import { SidebarContext } from '@/context/sidebar-context'
import { STORAGE_KEYS, storage } from '@/utils/storage'

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(
    () => storage.get(STORAGE_KEYS.SIDEBAR_COLLAPSED, false) === true,
  )
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = useCallback(() => {
    setCollapsed((current) => {
      const next = !current
      storage.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, next)
      return next
    })
  }, [])

  const openMobile = useCallback(() => setMobileOpen(true), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen((current) => !current), [])

  const value = useMemo(
    () => ({
      collapsed,
      mobileOpen,
      toggleCollapsed,
      openMobile,
      closeMobile,
      toggleMobile,
      setMobileOpen,
    }),
    [collapsed, mobileOpen, toggleCollapsed, openMobile, closeMobile, toggleMobile],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}
