export const SYSTEM_STATUS = [
  { id: 'database', label: 'Database', status: 'operational', latency: '12ms', uptime: '99.99%' },
  { id: 'api', label: 'API', status: 'operational', latency: '45ms', uptime: '99.95%' },
  { id: 'storage', label: 'Storage', status: 'operational', latency: '28ms', uptime: '99.98%' },
  { id: 'notifications', label: 'Notification Service', status: 'degraded', latency: '120ms', uptime: '99.80%' },
]

export const PLATFORM_SETTINGS_DEFAULTS = {
  platformName: 'PLMM',
  maintenanceMode: false,
  registrationEnabled: true,
  maxSessionDuration: 120,
  defaultSessionDuration: 60,
  emailNotifications: true,
  pushNotifications: true,
  sessionReminders: true,
  twoFactorRequired: false,
  sessionTimeout: 30,
  passwordMinLength: 8,
}
