import { Suspense } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { AuthBootstrap } from '@/components/common/AuthBootstrap'
import { GuestRoute } from '@/components/common/GuestRoute'
import { PageLoader } from '@/components/common/PageLoader'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { RoleGuard } from '@/components/common/RoleGuard'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { dashboardRouteGroups } from '@/routes/dashboardRoutes'
import { About, Home, Login, NotFound, Register } from '@/routes/lazyPages'
import { ROUTES } from '@/constants/routes'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthBootstrap>
        <Suspense fallback={<PageLoader label="Loading application..." />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.ABOUT} element={<About />} />
              <Route element={<GuestRoute />}>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
              </Route>
              <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                {dashboardRouteGroups.map((group) => (
                  <Route
                    key={group.path}
                    path={group.path}
                    element={
                      <RoleGuard allowedRoles={group.allowedRoles}>
                        <Outlet />
                      </RoleGuard>
                    }
                  >
                    {group.routes.map((route) =>
                      route.index ? (
                        <Route key={`${group.path}-index`} index element={route.element} />
                      ) : (
                        <Route key={route.path} path={route.path} element={route.element} />
                      ),
                    )}
                  </Route>
                ))}
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthBootstrap>
    </BrowserRouter>
  )
}
