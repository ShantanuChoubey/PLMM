import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthBootstrap } from '@/components/common/AuthBootstrap'
import { GuestRoute } from '@/components/common/GuestRoute'
import { ProtectedAreaPlaceholder } from '@/components/common/ProtectedAreaPlaceholder'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { RoleGuard } from '@/components/common/RoleGuard'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { protectedRouteConfig } from '@/routes/protectedRouteConfig'
import { ROUTES } from '@/constants/routes'
import About from '@/pages/public/About'
import Home from '@/pages/public/Home'
import Login from '@/pages/public/Login'
import NotFound from '@/pages/public/NotFound'
import Register from '@/pages/public/Register'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthBootstrap>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route element={<GuestRoute />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              {protectedRouteConfig.map(({ path, area, allowedRoles }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <RoleGuard allowedRoles={allowedRoles}>
                      <ProtectedAreaPlaceholder area={area} allowedRoles={allowedRoles} />
                    </RoleGuard>
                  }
                />
              ))}
            </Route>
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          </Route>
        </Routes>
      </AuthBootstrap>
    </BrowserRouter>
  )
}
