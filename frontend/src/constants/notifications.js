export const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Session reminder',
    message: 'Your mentoring session starts in 30 minutes.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
  },
  {
    id: '2',
    title: 'New recommendation',
    message: 'A mentor match has been suggested based on your goals.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: '3',
    title: 'Resource shared',
    message: 'A new study resource was added to your learning path.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: '4',
    title: 'Group update',
    message: 'Your study group scheduled a new collaboration session.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
  },
]
