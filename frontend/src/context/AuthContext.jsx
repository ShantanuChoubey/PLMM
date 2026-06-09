import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '@/context/auth-context'
import { authService } from '@/services/authService'
import { showAuthError, showAuthSuccess } from '@/utils/authErrors'
import { AUTH_EVENTS } from '@/utils/authEvents'
import { appToast } from '@/utils/toast'
import { storage } from '@/utils/storage'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [error, setError] = useState(null)

  const persistSession = useCallback((sessionToken, user) => {
    storage.setToken(sessionToken)
    storage.setUser(user)
    setToken(sessionToken)
    setCurrentUser(user)
  }, [])

  const clearSession = useCallback(() => {
    storage.clearAuth()
    setToken(null)
    setCurrentUser(null)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function initializeAuth() {
      const storedToken = storage.getToken()
      const storedUser = storage.getUser()

      if (!storedToken || !storedUser) {
        if (isMounted) {
          setInitializing(false)
        }
        return
      }

      try {
        const user = await authService.getCurrentUser(storedToken)

        if (isMounted) {
          persistSession(storedToken, user)
        }
      } catch (authError) {
        clearSession()
        if (isMounted) {
          showAuthError(authError)
        }
      } finally {
        if (isMounted) {
          setInitializing(false)
        }
      }
    }

    initializeAuth()

    return () => {
      isMounted = false
    }
  }, [clearSession, persistSession])

  useEffect(() => {
    function handleSessionExpired() {
      clearSession()
      appToast.error('Your session has expired. Please sign in again.')
    }

    window.addEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired)
    return () => window.removeEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired)
  }, [clearSession])

  const login = useCallback(
    async (credentials) => {
      setLoading(true)
      setError(null)

      try {
        const response = await authService.login(credentials)
        persistSession(response.token, response.user)
        return response.user
      } catch (authError) {
        setError(authError)
        showAuthError(authError)
        throw authError
      } finally {
        setLoading(false)
      }
    },
    [persistSession],
  )

  const register = useCallback(async (payload) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.register(payload)
      showAuthSuccess(response.message)
      return response
    } catch (authError) {
      setError(authError)
      showAuthError(authError)
      throw authError
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await authService.logout()
      clearSession()
      showAuthSuccess('You have been signed out.')
    } catch (authError) {
      setError(authError)
      showAuthError(authError)
      clearSession()
    } finally {
      setLoading(false)
    }
  }, [clearSession])

  const value = useMemo(
    () => ({
      user: currentUser,
      currentUser,
      token,
      isAuthenticated: Boolean(currentUser && token),
      loading,
      initializing,
      error,
      login,
      logout,
      register,
    }),
    [currentUser, token, loading, initializing, error, login, logout, register],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
