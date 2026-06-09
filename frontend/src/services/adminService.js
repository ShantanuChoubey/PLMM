import { apiGet, apiPatch, apiPost } from '@/services/mockClient'
import { ADMIN_MENTORS, getMentorById } from '@/mock/mentorsAdminData'
import { AUDIT_LOGS, AUDIT_ACTION_TYPES, AUDIT_ENTITY_TYPES } from '@/mock/auditLogsData'
import { PLATFORM_SETTINGS_DEFAULTS, SYSTEM_STATUS } from '@/mock/systemStatusData'

function filterAuditLogs(logs, params = {}) {
  let result = [...logs]
  const { search, action, entityType, dateRange } = params
  const mockNow = new Date('2026-06-10T12:00:00Z').getTime()

  if (search) {
    const q = search.toLowerCase()
    result = result.filter((l) => l.description.toLowerCase().includes(q) || l.admin.toLowerCase().includes(q))
  }
  if (action && action !== 'all') result = result.filter((l) => l.action === action)
  if (entityType && entityType !== 'all') result = result.filter((l) => l.entityType === entityType)
  if (dateRange === '7d') {
    const cutoff = mockNow - 7 * 24 * 60 * 60 * 1000
    result = result.filter((l) => new Date(l.timestamp).getTime() >= cutoff)
  }
  if (dateRange === '30d') {
    const cutoff = mockNow - 30 * 24 * 60 * 60 * 1000
    result = result.filter((l) => new Date(l.timestamp).getTime() >= cutoff)
  }

  return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export const adminService = {
  getMentors(params = {}) {
    let result = [...ADMIN_MENTORS]
    if (params.search) {
      const q = params.search.toLowerCase()
      result = result.filter((m) => m.name.toLowerCase().includes(q) || m.expertise.some((e) => e.toLowerCase().includes(q)))
    }
    return apiGet('/admin/mentors', {
      params,
      mockHandler: () => ({ data: result, meta: { total: result.length } }),
    })
  },

  getMentorById(id) {
    return apiGet(`/admin/mentors/${id}`, {
      mockHandler: () => {
        const mentor = getMentorById(id)
        if (!mentor) throw new Error('Mentor not found')
        return { data: mentor }
      },
    })
  },

  updateMentorStatus(id, status) {
    return apiPatch(`/admin/mentors/${id}/status`, {
      data: { status },
      mockHandler: () => ({ data: { id, status } }),
    })
  },

  getAuditLogs(params = {}) {
    const filtered = filterAuditLogs(AUDIT_LOGS, params)
    return apiGet('/admin/audit-logs', {
      params,
      mockHandler: () => ({
        data: filtered,
        meta: {
          total: filtered.length,
          actionTypes: AUDIT_ACTION_TYPES,
          entityTypes: AUDIT_ENTITY_TYPES,
        },
      }),
    })
  },

  getSettings() {
    return apiGet('/admin/settings', {
      mockHandler: () => ({ data: PLATFORM_SETTINGS_DEFAULTS }),
    })
  },

  updateSettings(payload) {
    return apiPost('/admin/settings', {
      data: payload,
      mockHandler: () => ({ data: payload }),
    })
  },

  getSystemStatus() {
    return apiGet('/admin/system-status', {
      mockHandler: () => ({ data: SYSTEM_STATUS }),
    })
  },
}
