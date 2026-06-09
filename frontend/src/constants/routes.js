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

export const LEARNER_ROUTES = {
  ROOT: '/learner',
  DASHBOARD: '/learner/dashboard',
  PROFILE: '/learner/profile',
  MENTORS: '/learner/mentors',
  MENTOR_DETAILS: '/learner/mentors/:id',
  RECOMMENDATIONS: '/learner/recommendations',
  SESSIONS: '/learner/sessions',
  GROUPS: '/learner/groups',
  RESOURCES: '/learner/resources',
  PROGRESS: '/learner/progress',
  NOTIFICATIONS: '/learner/notifications',
  SETTINGS: '/learner/settings',
}

export const MENTOR_ROUTES = {
  ROOT: '/mentor',
  DASHBOARD: '/mentor/dashboard',
  PROFILE: '/mentor/profile',
  AVAILABILITY: '/mentor/availability',
  SESSIONS: '/mentor/sessions',
  REVIEWS: '/mentor/reviews',
  GROUPS: '/mentor/groups',
  RESOURCES: '/mentor/resources',
  NOTIFICATIONS: '/mentor/notifications',
  SETTINGS: '/mentor/settings',
}

export const FACULTY_ROUTES = {
  ROOT: '/faculty',
  DASHBOARD: '/faculty/dashboard',
  PROFILE: '/faculty/profile',
  MENTEES: '/faculty/mentees',
  SESSIONS: '/faculty/sessions',
  GROUPS: '/faculty/groups',
  RESOURCES: '/faculty/resources',
  REVIEWS: '/faculty/reviews',
  NOTIFICATIONS: '/faculty/notifications',
  SETTINGS: '/faculty/settings',
}

export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  USERS: '/admin/users',
  MENTORS: '/admin/mentors',
  SESSIONS: '/admin/sessions',
  GROUPS: '/admin/groups',
  RESOURCES: '/admin/resources',
  ANALYTICS: '/admin/analytics',
  AUDIT_LOGS: '/admin/audit-logs',
  SETTINGS: '/admin/settings',
  NOTIFICATIONS: '/admin/notifications',
}

export const PUBLIC_ROUTES = [
  { path: ROUTES.HOME, label: 'Home' },
  { path: ROUTES.ABOUT, label: 'About' },
]

export const GUEST_ONLY_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER]
