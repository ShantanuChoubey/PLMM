import { PROTECTED_ROUTES, ROUTES } from '@/constants/routes'

export const ROLES = {
  LEARNER: 'learner',
  PEER_MENTOR: 'peer_mentor',
  FACULTY_MENTOR: 'faculty_mentor',
  ADMIN: 'admin',
}

export const ROLE_LABELS = {
  [ROLES.LEARNER]: 'Learner',
  [ROLES.PEER_MENTOR]: 'Peer Mentor',
  [ROLES.FACULTY_MENTOR]: 'Faculty Mentor',
  [ROLES.ADMIN]: 'Admin',
}

export const ROLE_OPTIONS = [
  { value: ROLES.LEARNER, label: ROLE_LABELS[ROLES.LEARNER] },
  { value: ROLES.PEER_MENTOR, label: ROLE_LABELS[ROLES.PEER_MENTOR] },
  { value: ROLES.FACULTY_MENTOR, label: ROLE_LABELS[ROLES.FACULTY_MENTOR] },
]

export const ROLE_HOME_ROUTES = {
  [ROLES.LEARNER]: PROTECTED_ROUTES.LEARNER,
  [ROLES.PEER_MENTOR]: PROTECTED_ROUTES.MENTOR,
  [ROLES.FACULTY_MENTOR]: PROTECTED_ROUTES.FACULTY,
  [ROLES.ADMIN]: PROTECTED_ROUTES.ADMIN,
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] ?? 'User'
}

export function getRoleHomeRoute(role) {
  return ROLE_HOME_ROUTES[role] ?? ROUTES.HOME
}

export function isRoleAllowed(role, allowedRoles = []) {
  return allowedRoles.includes(role)
}
