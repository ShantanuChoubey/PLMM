import { ROLES } from '@/constants/roles'

export const ADMIN_USERS = [
  { id: 'u1', name: 'Demo User', email: 'demo@example.com', role: ROLES.LEARNER, status: 'active', joinDate: '2025-09-12', lastActive: '2026-06-10', groupsJoined: 2, sessionsCompleted: 8, resourcesShared: 3 },
  { id: 'u2', name: 'Jamie Lee', email: 'jamie.lee@example.com', role: ROLES.LEARNER, status: 'active', joinDate: '2025-10-03', lastActive: '2026-06-09', groupsJoined: 3, sessionsCompleted: 12, resourcesShared: 5 },
  { id: 'u3', name: 'Alex Parker', email: 'alex.parker@example.com', role: ROLES.LEARNER, status: 'active', joinDate: '2025-11-18', lastActive: '2026-06-08', groupsJoined: 1, sessionsCompleted: 5, resourcesShared: 2 },
  { id: 'u4', name: 'Sarah Chen', email: 'sarah.chen@example.com', role: ROLES.PEER_MENTOR, status: 'active', joinDate: '2025-08-01', lastActive: '2026-06-10', groupsJoined: 4, sessionsCompleted: 48, resourcesShared: 18 },
  { id: 'u5', name: 'Elena Rodriguez', email: 'elena.r@example.com', role: ROLES.PEER_MENTOR, status: 'active', joinDate: '2025-08-15', lastActive: '2026-06-09', groupsJoined: 3, sessionsCompleted: 42, resourcesShared: 22 },
  { id: 'u6', name: 'Marcus Johnson', email: 'marcus.j@example.com', role: ROLES.PEER_MENTOR, status: 'pending', joinDate: '2026-05-20', lastActive: '2026-06-07', groupsJoined: 1, sessionsCompleted: 0, resourcesShared: 1 },
  { id: 'u7', name: 'Dr. Priya Sharma', email: 'priya.sharma@university.edu', role: ROLES.FACULTY_MENTOR, status: 'active', joinDate: '2025-07-10', lastActive: '2026-06-10', groupsJoined: 5, sessionsCompleted: 36, resourcesShared: 14 },
  { id: 'u8', name: 'Chris Morgan', email: 'chris.m@example.com', role: ROLES.LEARNER, status: 'suspended', joinDate: '2025-12-01', lastActive: '2026-04-15', groupsJoined: 0, sessionsCompleted: 2, resourcesShared: 0 },
  { id: 'u9', name: 'Aisha Patel', email: 'aisha.p@example.com', role: ROLES.PEER_MENTOR, status: 'active', joinDate: '2025-09-22', lastActive: '2026-06-08', groupsJoined: 2, sessionsCompleted: 28, resourcesShared: 12 },
  { id: 'u10', name: 'David Kim', email: 'david.kim@example.com', role: ROLES.LEARNER, status: 'active', joinDate: '2026-01-14', lastActive: '2026-06-06', groupsJoined: 2, sessionsCompleted: 6, resourcesShared: 4 },
  { id: 'u11', name: 'Taylor Brooks', email: 'taylor.b@example.com', role: ROLES.LEARNER, status: 'inactive', joinDate: '2025-06-30', lastActive: '2026-02-20', groupsJoined: 1, sessionsCompleted: 3, resourcesShared: 1 },
  { id: 'u12', name: 'James Wilson', email: 'james.w@example.com', role: ROLES.PEER_MENTOR, status: 'active', joinDate: '2025-08-28', lastActive: '2026-06-09', groupsJoined: 3, sessionsCompleted: 35, resourcesShared: 11 },
]

export const USER_STATUS_OPTIONS = ['all', 'active', 'inactive', 'suspended', 'pending']

export function getUserById(id) {
  return ADMIN_USERS.find((u) => u.id === id) ?? null
}
