import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  Clock,
  LayoutDashboard,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  User,
  Users,
  UsersRound,
} from 'lucide-react'
import {
  ADMIN_ROUTES,
  FACULTY_ROUTES,
  LEARNER_ROUTES,
  MENTOR_ROUTES,
} from '@/constants/routes'
import { ROLES } from '@/constants/roles'

export const LEARNER_NAVIGATION = [
  {
    group: 'Overview',
    items: [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        route: LEARNER_ROUTES.DASHBOARD,
        allowedRoles: [ROLES.LEARNER],
      },
      {
        label: 'Profile',
        icon: User,
        route: LEARNER_ROUTES.PROFILE,
        allowedRoles: [ROLES.LEARNER],
      },
    ],
  },
  {
    group: 'Learning',
    items: [
      {
        label: 'Mentors',
        icon: Users,
        route: LEARNER_ROUTES.MENTORS,
        allowedRoles: [ROLES.LEARNER],
      },
      {
        label: 'Recommendations',
        icon: Sparkles,
        route: LEARNER_ROUTES.RECOMMENDATIONS,
        allowedRoles: [ROLES.LEARNER],
      },
      {
        label: 'Sessions',
        icon: Calendar,
        route: LEARNER_ROUTES.SESSIONS,
        allowedRoles: [ROLES.LEARNER],
      },
      {
        label: 'Groups',
        icon: UsersRound,
        route: LEARNER_ROUTES.GROUPS,
        allowedRoles: [ROLES.LEARNER],
      },
      {
        label: 'Resources',
        icon: BookOpen,
        route: LEARNER_ROUTES.RESOURCES,
        allowedRoles: [ROLES.LEARNER],
      },
      {
        label: 'Progress',
        icon: TrendingUp,
        route: LEARNER_ROUTES.PROGRESS,
        allowedRoles: [ROLES.LEARNER],
      },
    ],
  },
  {
    group: 'Account',
    items: [
      {
        label: 'Notifications',
        icon: Bell,
        route: LEARNER_ROUTES.NOTIFICATIONS,
        allowedRoles: [ROLES.LEARNER],
      },
    ],
  },
]

export const MENTOR_NAVIGATION = [
  {
    group: 'Overview',
    items: [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        route: MENTOR_ROUTES.DASHBOARD,
        allowedRoles: [ROLES.PEER_MENTOR],
      },
      {
        label: 'Profile',
        icon: User,
        route: MENTOR_ROUTES.PROFILE,
        allowedRoles: [ROLES.PEER_MENTOR],
      },
    ],
  },
  {
    group: 'Mentoring',
    items: [
      {
        label: 'Availability',
        icon: Clock,
        route: MENTOR_ROUTES.AVAILABILITY,
        allowedRoles: [ROLES.PEER_MENTOR],
      },
      {
        label: 'Sessions',
        icon: Calendar,
        route: MENTOR_ROUTES.SESSIONS,
        allowedRoles: [ROLES.PEER_MENTOR],
      },
      {
        label: 'Reviews',
        icon: Star,
        route: MENTOR_ROUTES.REVIEWS,
        allowedRoles: [ROLES.PEER_MENTOR],
      },
      {
        label: 'Groups',
        icon: UsersRound,
        route: MENTOR_ROUTES.GROUPS,
        allowedRoles: [ROLES.PEER_MENTOR],
      },
      {
        label: 'Resources',
        icon: BookOpen,
        route: MENTOR_ROUTES.RESOURCES,
        allowedRoles: [ROLES.PEER_MENTOR],
      },
    ],
  },
  {
    group: 'Account',
    items: [
      {
        label: 'Notifications',
        icon: Bell,
        route: MENTOR_ROUTES.NOTIFICATIONS,
        allowedRoles: [ROLES.PEER_MENTOR],
      },
    ],
  },
]

export const FACULTY_NAVIGATION = [
  {
    group: 'Overview',
    items: [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        route: FACULTY_ROUTES.DASHBOARD,
        allowedRoles: [ROLES.FACULTY_MENTOR],
      },
      {
        label: 'Profile',
        icon: User,
        route: FACULTY_ROUTES.PROFILE,
        allowedRoles: [ROLES.FACULTY_MENTOR],
      },
    ],
  },
  {
    group: 'Mentoring',
    items: [
      {
        label: 'Mentees',
        icon: Users,
        route: FACULTY_ROUTES.MENTEES,
        allowedRoles: [ROLES.FACULTY_MENTOR],
      },
      {
        label: 'Sessions',
        icon: Calendar,
        route: FACULTY_ROUTES.SESSIONS,
        allowedRoles: [ROLES.FACULTY_MENTOR],
      },
      {
        label: 'Groups',
        icon: UsersRound,
        route: FACULTY_ROUTES.GROUPS,
        allowedRoles: [ROLES.FACULTY_MENTOR],
      },
      {
        label: 'Resources',
        icon: BookOpen,
        route: FACULTY_ROUTES.RESOURCES,
        allowedRoles: [ROLES.FACULTY_MENTOR],
      },
      {
        label: 'Reviews',
        icon: Star,
        route: FACULTY_ROUTES.REVIEWS,
        allowedRoles: [ROLES.FACULTY_MENTOR],
      },
    ],
  },
  {
    group: 'Account',
    items: [
      {
        label: 'Notifications',
        icon: Bell,
        route: FACULTY_ROUTES.NOTIFICATIONS,
        allowedRoles: [ROLES.FACULTY_MENTOR],
      },
    ],
  },
]

export const ADMIN_NAVIGATION = [
  {
    group: 'Overview',
    items: [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        route: ADMIN_ROUTES.DASHBOARD,
        allowedRoles: [ROLES.ADMIN],
      },
    ],
  },
  {
    group: 'Management',
    items: [
      {
        label: 'Users',
        icon: Users,
        route: ADMIN_ROUTES.USERS,
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: 'Mentors',
        icon: User,
        route: ADMIN_ROUTES.MENTORS,
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: 'Sessions',
        icon: Calendar,
        route: ADMIN_ROUTES.SESSIONS,
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: 'Groups',
        icon: UsersRound,
        route: ADMIN_ROUTES.GROUPS,
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: 'Resources',
        icon: BookOpen,
        route: ADMIN_ROUTES.RESOURCES,
        allowedRoles: [ROLES.ADMIN],
      },
    ],
  },
  {
    group: 'Insights',
    items: [
      {
        label: 'Analytics',
        icon: BarChart3,
        route: ADMIN_ROUTES.ANALYTICS,
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: 'Audit Logs',
        icon: ClipboardList,
        route: ADMIN_ROUTES.AUDIT_LOGS,
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: 'Settings',
        icon: Settings,
        route: ADMIN_ROUTES.SETTINGS,
        allowedRoles: [ROLES.ADMIN],
      },
    ],
  },
  {
    group: 'Account',
    items: [
      {
        label: 'Notifications',
        icon: Bell,
        route: ADMIN_ROUTES.NOTIFICATIONS,
        allowedRoles: [ROLES.ADMIN],
      },
    ],
  },
]

export const ROLE_NAVIGATION = {
  [ROLES.LEARNER]: LEARNER_NAVIGATION,
  [ROLES.PEER_MENTOR]: MENTOR_NAVIGATION,
  [ROLES.FACULTY_MENTOR]: FACULTY_NAVIGATION,
  [ROLES.ADMIN]: ADMIN_NAVIGATION,
}

export function getNavigationForRole(role) {
  return ROLE_NAVIGATION[role] ?? []
}

export function flattenNavigation(navigation) {
  return navigation.flatMap((group) => group.items)
}

export function findNavItemByPath(pathname, navigation) {
  const items = flattenNavigation(navigation)
  return items.find((item) => item.route === pathname) ?? null
}

export function getProfileRouteForRole(role) {
  const routes = {
    [ROLES.LEARNER]: LEARNER_ROUTES.PROFILE,
    [ROLES.PEER_MENTOR]: MENTOR_ROUTES.PROFILE,
    [ROLES.FACULTY_MENTOR]: FACULTY_ROUTES.PROFILE,
    [ROLES.ADMIN]: ADMIN_ROUTES.SETTINGS,
  }

  return routes[role] ?? LEARNER_ROUTES.PROFILE
}

export function getSettingsRouteForRole(role) {
  const routes = {
    [ROLES.LEARNER]: LEARNER_ROUTES.SETTINGS,
    [ROLES.PEER_MENTOR]: MENTOR_ROUTES.SETTINGS,
    [ROLES.FACULTY_MENTOR]: FACULTY_ROUTES.SETTINGS,
    [ROLES.ADMIN]: ADMIN_ROUTES.SETTINGS,
  }

  return routes[role] ?? LEARNER_ROUTES.SETTINGS
}
