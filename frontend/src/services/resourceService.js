import { apiGet, apiPost, apiPatch } from '@/services/mockClient'
import {
  HUB_RESOURCES,
  RESOURCE_USAGE_CHART,
  MENTOR_RESOURCES,
  FACULTY_RESOURCES,
  RESOURCE_CATEGORIES,
  RESOURCE_TYPES,
  getHubResourceById,
} from '@/mock/resourceData'
import { HUB_RESOURCE_CATEGORIES, HUB_RESOURCE_TYPES, RESOURCE_SORT_OPTIONS } from '@/mock/resourceCategories'
import { RECOMMENDED_HUB_RESOURCES } from '@/mock/recommendedResources'
import { BOOKMARKED_RESOURCE_IDS, FAVORITE_CATEGORIES } from '@/mock/bookmarkedResources'
import { ADMIN_RESOURCES } from '@/mock/resourcesAdminData'

function filterHubResources(resources, params = {}) {
  let result = [...resources]
  const { search, category, type, sort } = params

  if (search) {
    const q = search.toLowerCase()
    result = result.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)))
  }
  if (category && category !== 'all') result = result.filter((r) => r.category === category)
  if (type && type !== 'all') result = result.filter((r) => r.type === type)
  if (sort === 'newest') result.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
  if (sort === 'popular') result.sort((a, b) => b.views - a.views)
  if (sort === 'downloads') result.sort((a, b) => b.downloads - a.downloads)
  if (sort === 'recent') result.sort((a, b) => (b.recentlyViewed ? 1 : 0) - (a.recentlyViewed ? 1 : 0))

  return result
}

export const resourceService = {
  getHubResources(params = {}) {
    const filtered = filterHubResources(HUB_RESOURCES, params)
    return apiGet('/resources', {
      params,
      mockHandler: () => ({
        data: filtered,
        meta: {
          total: filtered.length,
          categories: HUB_RESOURCE_CATEGORIES,
          types: HUB_RESOURCE_TYPES,
          sortOptions: RESOURCE_SORT_OPTIONS,
        },
        chart: RESOURCE_USAGE_CHART,
        bookmarkedIds: BOOKMARKED_RESOURCE_IDS,
      }),
    })
  },

  getHubResourceById(id) {
    return apiGet(`/resources/${id}`, {
      mockHandler: () => {
        const resource = getHubResourceById(id)
        if (!resource) throw new Error('Resource not found')
        return { data: resource }
      },
    })
  },

  getRecommended() {
    return apiGet('/resources/recommended', {
      mockHandler: () => ({ data: RECOMMENDED_HUB_RESOURCES }),
    })
  },

  getBookmarks() {
    return apiGet('/resources/bookmarks', {
      mockHandler: () => ({
        data: HUB_RESOURCES.filter((r) => BOOKMARKED_RESOURCE_IDS.includes(r.id)),
        meta: { bookmarkedIds: BOOKMARKED_RESOURCE_IDS, favoriteCategories: FAVORITE_CATEGORIES },
      }),
    })
  },

  uploadResource(payload) {
    return apiPost('/resources', {
      data: payload,
      mockHandler: () => ({
        data: {
          id: `hub-${crypto.randomUUID()}`,
          ...payload,
          uploader: 'You',
          views: 0,
          downloads: 0,
          rating: 0,
          uploadedAt: new Date().toISOString().slice(0, 10),
          recentlyViewed: false,
        },
      }),
    })
  },

  toggleBookmark(id) {
    return apiPatch(`/resources/${id}/bookmark`, {
      mockHandler: () => ({ data: { id } }),
    })
  },

  getMentorResources() {
    return apiGet('/mentor/resources', { mockHandler: () => ({ data: MENTOR_RESOURCES, meta: { categories: RESOURCE_CATEGORIES, types: RESOURCE_TYPES } }) })
  },

  getFacultyResources() {
    return apiGet('/faculty/resources', { mockHandler: () => ({ data: FACULTY_RESOURCES }) })
  },

  getAdminResources(params = {}) {
    let result = [...ADMIN_RESOURCES]
    if (params.search) {
      const q = params.search.toLowerCase()
      result = result.filter((r) => r.title.toLowerCase().includes(q) || r.uploader.toLowerCase().includes(q))
    }
    if (params.type && params.type !== 'all') result = result.filter((r) => r.type === params.type)
    return apiGet('/admin/resources', {
      params,
      mockHandler: () => ({ data: result, meta: { total: result.length, types: HUB_RESOURCE_TYPES } }),
    })
  },
}
