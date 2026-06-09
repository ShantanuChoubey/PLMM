import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  Search,
  Sparkles,
  UsersRound,
} from 'lucide-react'

export const EMPTY_STATES = {
  sessions: {
    icon: Calendar,
    title: 'No sessions found',
    description: 'You have no sessions in this category yet. Book a mentor to get started.',
  },
  groups: {
    icon: UsersRound,
    title: 'No groups found',
    description: 'Try adjusting your search or filters, or create a new study group.',
  },
  resources: {
    icon: BookOpen,
    title: 'No resources found',
    description: 'No resources match your criteria. Try different filters or upload one.',
  },
  notifications: {
    icon: Bell,
    title: 'No notifications',
    description: "You're all caught up. New updates will appear here.",
  },
  recommendations: {
    icon: Sparkles,
    title: 'No recommendations yet',
    description: 'Complete your profile and learning goals to receive personalized suggestions.',
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: 'Try different keywords or clear your filters.',
  },
  analytics: {
    icon: BarChart3,
    title: 'No analytics data',
    description: 'Analytics will appear once there is enough platform activity.',
  },
}
