export const GROUP_MEMBERS = {
  g1: [
    { id: 'm1', name: 'Demo User', role: 'Learner', joinedAt: '2026-03-15', status: 'active' },
    { id: 'm2', name: 'Sarah Chen', role: 'Mentor', joinedAt: '2026-01-10', status: 'active' },
    { id: 'm3', name: 'Alex Parker', role: 'Learner', joinedAt: '2026-04-02', status: 'active' },
    { id: 'm4', name: 'Jamie Lee', role: 'Learner', joinedAt: '2026-04-18', status: 'active' },
    { id: 'm5', name: 'Chris Morgan', role: 'Learner', joinedAt: '2026-05-05', status: 'inactive' },
  ],
  g2: [
    { id: 'm6', name: 'Demo User', role: 'Learner', joinedAt: '2026-02-20', status: 'active' },
    { id: 'm7', name: 'Elena Rodriguez', role: 'Mentor', joinedAt: '2026-01-05', status: 'active' },
    { id: 'm8', name: 'Priya Sharma', role: 'Learner', joinedAt: '2026-03-12', status: 'active' },
  ],
}

export function getGroupMembers(groupId) {
  return GROUP_MEMBERS[groupId] ?? []
}
