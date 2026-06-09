export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  NOT_FOUND: '*',
}

export const PROTECTED_ROUTES = {
  LEARNER: '/learner',
  MENTOR: '/mentor',
  FACULTY: '/faculty',
  ADMIN: '/admin',
}

export const PUBLIC_ROUTES = [
  { path: ROUTES.HOME, label: 'Home' },
  { path: ROUTES.ABOUT, label: 'About' },
]

export const GUEST_ONLY_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER]
