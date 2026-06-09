import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SidebarProvider } from '@/context/SidebarProvider'
import { MobileSidebar } from '@/components/layout/MobileSidebar'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNavbar } from '@/components/layout/TopNavbar'

function DashboardFooter() {
  return (
    <footer className="border-t border-border/60 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
      <p>&copy; {new Date().getFullYear()} PLMM. All rights reserved.</p>
    </footer>
  )
}

function DashboardContent() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <MobileSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  )
}

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  )
}
