const isBrowser = typeof window !== 'undefined'

export const storage = {
  get(key, fallback = null) {
    if (!isBrowser) return fallback

    try {
      const value = window.localStorage.getItem(key)
      return value === null ? fallback : JSON.parse(value)
    } catch {
      return fallback
    }
  },

  set(key, value) {
    if (!isBrowser) return

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Silently fail when storage is unavailable
    }
  },

  remove(key) {
    if (!isBrowser) return

    try {
      window.localStorage.removeItem(key)
    } catch {
      // Silently fail when storage is unavailable
    }
  },

  getString(key, fallback = '') {
    if (!isBrowser) return fallback

    try {
      return window.localStorage.getItem(key) ?? fallback
    } catch {
      return fallback
    }
  },

  setString(key, value) {
    if (!isBrowser) return

    try {
      window.localStorage.setItem(key, value)
    } catch {
      // Silently fail when storage is unavailable
    }
  },

  setToken(token) {
    this.setString(STORAGE_KEYS.AUTH_TOKEN, token)
  },

  getToken() {
    return this.getString(STORAGE_KEYS.AUTH_TOKEN)
  },

  removeToken() {
    if (!isBrowser) return

    try {
      window.localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    } catch {
      // Silently fail when storage is unavailable
    }
  },

  setUser(user) {
    this.set(STORAGE_KEYS.AUTH_USER, user)
  },

  getUser() {
    return this.get(STORAGE_KEYS.AUTH_USER)
  },

  removeUser() {
    this.remove(STORAGE_KEYS.AUTH_USER)
  },

  clearAuth() {
    this.removeToken()
    this.removeUser()
  },
}

export const STORAGE_KEYS = {
  THEME: 'plmm-theme',
  AUTH_TOKEN: 'plmm-auth-token',
  AUTH_USER: 'plmm-auth-user',
  MOCK_USERS: 'plmm-mock-users',
  SIDEBAR_COLLAPSED: 'plmm-sidebar-collapsed',
}
