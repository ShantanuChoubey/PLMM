import axios from 'axios'
import { normalizeApiError } from '@/utils/apiError'
import { emitSessionExpired } from '@/utils/authEvents'
import { storage } from '@/utils/storage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(normalizeApiError(error)),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeApiError(error)

    if (normalized.status === 401 || normalized.code === 'SESSION_EXPIRED' || normalized.code === 'UNAUTHORIZED') {
      storage.clearAuth()
      emitSessionExpired()
    }

    return Promise.reject(normalized)
  },
)

export default api
