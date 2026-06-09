import { apiGet, apiPost, apiPatch } from '@/services/mockClient'
import { STUDY_GROUPS, GROUP_GROWTH_CHART, COMMUNITY_ACTIVITY_CHART, getGroupById } from '@/mock/groupsData'
import { getGroupMembers } from '@/mock/groupMembersData'
import { getGroupActivity, RECENT_GROUP_ACTIVITY } from '@/mock/groupActivityData'
import { GROUP_CATEGORIES } from '@/mock/resourceCategories'
import { ADMIN_GROUPS } from '@/mock/groupsAdminData'

function filterGroups(groups, params = {}) {
  let result = [...groups]
  const { search, category, filter } = params

  if (search) {
    const q = search.toLowerCase()
    result = result.filter((g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q) || g.tags.some((t) => t.toLowerCase().includes(q)))
  }
  if (category && category !== 'all') result = result.filter((g) => g.category === category)
  if (filter === 'my') result = result.filter((g) => g.isJoined)
  if (filter === 'trending') result = result.filter((g) => g.trending)
  if (filter === 'recommended') result = result.filter((g) => g.recommended)

  return result
}

export const groupService = {
  getGroups(params = {}) {
    const filtered = filterGroups(STUDY_GROUPS, params)
    return apiGet('/groups', {
      params,
      mockHandler: () => ({
        data: filtered,
        meta: { total: filtered.length, categories: GROUP_CATEGORIES },
        charts: { growth: GROUP_GROWTH_CHART, community: COMMUNITY_ACTIVITY_CHART },
      }),
    })
  },

  getGroupById(id) {
    return apiGet(`/groups/${id}`, {
      mockHandler: () => {
        const group = getGroupById(id)
        if (!group) throw new Error('Group not found')
        return {
          data: group,
          members: getGroupMembers(id),
          activity: getGroupActivity(id),
        }
      },
    })
  },

  getRecentActivity() {
    return apiGet('/groups/activity/recent', {
      mockHandler: () => ({ data: RECENT_GROUP_ACTIVITY }),
    })
  },

  getJoinedGroups() {
    return apiGet('/groups/joined', {
      mockHandler: () => ({ data: STUDY_GROUPS.filter((g) => g.isJoined) }),
    })
  },

  createGroup(payload) {
    return apiPost('/groups', {
      data: payload,
      mockHandler: () => ({
        data: {
          ...payload,
          id: `g-${crypto.randomUUID()}`,
          memberCount: 1,
          createdBy: 'You',
          activityLevel: 'low',
          trending: false,
          recommended: false,
          isJoined: true,
          stats: { resourcesShared: 0, sessionsConducted: 0, weeklyActivity: 10 },
        },
      }),
    })
  },

  joinGroup(id) {
    return apiPatch(`/groups/${id}/join`, {
      mockHandler: () => ({ data: { id, isJoined: true } }),
    })
  },

  leaveGroup(id) {
    return apiPatch(`/groups/${id}/leave`, {
      mockHandler: () => ({ data: { id, isJoined: false } }),
    })
  },

  getAdminGroups(params = {}) {
    let result = [...ADMIN_GROUPS]
    if (params.search) {
      const q = params.search.toLowerCase()
      result = result.filter((g) => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q))
    }
    return apiGet('/admin/groups', {
      params,
      mockHandler: () => ({ data: result, meta: { total: result.length } }),
    })
  },
}
