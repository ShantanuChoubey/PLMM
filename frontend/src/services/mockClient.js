import api from '@/services/api'
import { normalizeApiError } from '@/utils/apiError'

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

const NETWORK_DELAY_MS = Number(import.meta.env.VITE_MOCK_DELAY_MS) || 400

export function simulateDelay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function paginateList(items, { page = 1, pageSize = 10 } = {}) {
  const start = (page - 1) * pageSize
  const data = items.slice(start, start + pageSize)
  return {
    data,
    meta: {
      total: items.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    },
  }
}

export async function mockRequest(handler, delay = NETWORK_DELAY_MS) {
  await simulateDelay(delay)
  const result = await handler()
  if (result?.data !== undefined) return result
  if (Array.isArray(result)) return { data: result, meta: { total: result.length } }
  return { data: result }
}

export async function apiRequest(method, url, { mockHandler, params, data, delay } = {}) {
  if (USE_MOCK_API) {
    return mockRequest(mockHandler, delay)
  }

  try {
    const response = await api({ method, url, params, data })
    return response.data
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export async function apiGet(url, options) {
  return apiRequest('get', url, options)
}

export async function apiPost(url, options) {
  return apiRequest('post', url, options)
}

export async function apiPatch(url, options) {
  return apiRequest('patch', url, options)
}

export async function apiDelete(url, options) {
  return apiRequest('delete', url, options)
}
