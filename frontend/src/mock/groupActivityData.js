export const GROUP_ACTIVITY = {
  g1: [
    { id: 'ga1', type: 'joined', user: 'Jamie Lee', message: 'joined the group', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: 'ga2', type: 'resource', user: 'Sarah Chen', message: 'uploaded React Hooks Cheat Sheet', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
    { id: 'ga3', type: 'session', user: 'Sarah Chen', message: 'scheduled a group study session', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { id: 'ga4', type: 'update', user: 'Alex Parker', message: 'posted a question about useEffect cleanup', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString() },
  ],
  g2: [
    { id: 'ga5', type: 'session', user: 'Elena Rodriguez', message: 'created a mock interview session', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
    { id: 'ga6', type: 'resource', user: 'Priya Sharma', message: 'shared Binary Tree patterns notes', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString() },
    { id: 'ga7', type: 'update', user: 'Demo User', message: 'posted weekly practice goals', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  ],
}

export const RECENT_GROUP_ACTIVITY = [
  { id: 'rga1', group: 'React Masters', type: 'resource', message: 'New resource: React Hooks Cheat Sheet', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: 'rga2', group: 'Algorithms Study Circle', type: 'session', message: 'Mock interview session scheduled', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: 'rga3', group: 'React Masters', type: 'joined', message: 'Jamie Lee joined the group', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
]

export function getGroupActivity(groupId) {
  return GROUP_ACTIVITY[groupId] ?? []
}
