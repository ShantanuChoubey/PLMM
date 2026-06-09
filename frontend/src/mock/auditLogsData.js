export const AUDIT_LOGS = [
  { id: 'al1', timestamp: '2026-06-10T14:32:00Z', admin: 'Admin User', action: 'suspend', entityType: 'user', entityId: 'u8', description: 'Suspended user Chris Morgan for policy violation' },
  { id: 'al2', timestamp: '2026-06-10T11:15:00Z', admin: 'Admin User', action: 'approve', entityType: 'mentor', entityId: 'm4', description: 'Approved mentor application for Marcus Johnson' },
  { id: 'al3', timestamp: '2026-06-09T16:45:00Z', admin: 'Admin User', action: 'delete', entityType: 'resource', entityId: 'r10', description: 'Removed flagged resource: Spam Content Report' },
  { id: 'al4', timestamp: '2026-06-09T09:20:00Z', admin: 'Admin User', action: 'flag', entityType: 'group', entityId: 'g6', description: 'Flagged group Cloud Native Builders for review' },
  { id: 'al5', timestamp: '2026-06-08T18:00:00Z', admin: 'Admin User', action: 'update', entityType: 'settings', entityId: 'platform', description: 'Updated session timeout settings' },
  { id: 'al6', timestamp: '2026-06-08T14:10:00Z', admin: 'Admin User', action: 'export', entityType: 'users', entityId: 'bulk', description: 'Exported user list (CSV mock)' },
  { id: 'al7', timestamp: '2026-06-07T10:30:00Z', admin: 'Admin User', action: 'activate', entityType: 'user', entityId: 'u11', description: 'Reactivated user Taylor Brooks' },
  { id: 'al8', timestamp: '2026-06-06T15:55:00Z', admin: 'Admin User', action: 'flag', entityType: 'resource', entityId: 'r4', description: 'Flagged resource for content review' },
  { id: 'al9', timestamp: '2026-06-05T08:40:00Z', admin: 'Admin User', action: 'create', entityType: 'announcement', entityId: 'ann1', description: 'Published platform maintenance notice' },
  { id: 'al10', timestamp: '2026-06-04T17:22:00Z', admin: 'Admin User', action: 'export', entityType: 'analytics', entityId: 'monthly', description: 'Exported monthly analytics report (mock)' },
  { id: 'al11', timestamp: '2026-06-03T12:00:00Z', admin: 'Admin User', action: 'suspend', entityType: 'mentor', entityId: 'm6', description: 'Suspended mentor Chris Morgan' },
  { id: 'al12', timestamp: '2026-06-02T09:15:00Z', admin: 'Admin User', action: 'delete', entityType: 'group', entityId: 'g-old', description: 'Deleted inactive group Legacy Study Group' },
]

export const AUDIT_ACTION_TYPES = ['all', 'create', 'update', 'delete', 'suspend', 'activate', 'approve', 'flag', 'export']

export const AUDIT_ENTITY_TYPES = ['all', 'user', 'mentor', 'session', 'group', 'resource', 'settings', 'announcement', 'users', 'analytics']
