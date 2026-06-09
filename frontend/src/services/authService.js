import { AUTH_ERROR_CODES, AuthError } from '@/constants/authErrors'
import { ROLES } from '@/constants/roles'
import { STORAGE_KEYS, storage } from '@/utils/storage'

const NETWORK_DELAY_MS = 800

const DEMO_USER = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: ROLES.LEARNER,
}

const DEMO_PASSWORD = 'password'

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function toPublicUser(entry) {
  return {
    id: entry.id,
    name: entry.name,
    email: entry.email,
    role: entry.role,
  }
}

function createToken(userId) {
  return `mock-token-${userId}-${Date.now()}`
}

function getMockUsers() {
  return storage.get(STORAGE_KEYS.MOCK_USERS, [])
}

function saveMockUser(user, password) {
  const users = getMockUsers()

  if (users.some((entry) => entry.email.toLowerCase() === user.email.toLowerCase())) {
    throw new AuthError(AUTH_ERROR_CODES.EMAIL_EXISTS)
  }

  storage.set(STORAGE_KEYS.MOCK_USERS, [...users, { ...user, password }])
}

function findUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase()

  if (normalizedEmail === DEMO_USER.email) {
    return { user: DEMO_USER, password: DEMO_PASSWORD }
  }

  const registeredUser = getMockUsers().find(
    (entry) => entry.email.toLowerCase() === normalizedEmail,
  )

  if (!registeredUser) {
    return null
  }

  return { user: toPublicUser(registeredUser), password: registeredUser.password }
}

function validateToken(token) {
  if (!token || !token.startsWith('mock-token-')) {
    throw new AuthError(AUTH_ERROR_CODES.SESSION_EXPIRED)
  }

  const userId = token.split('-')[2]
  const storedUser = storage.getUser()

  if (storedUser?.id === userId) {
    return storedUser
  }

  if (userId === DEMO_USER.id) {
    return DEMO_USER
  }

  const registeredUser = getMockUsers().find((entry) => entry.id === userId)

  if (!registeredUser) {
    throw new AuthError(AUTH_ERROR_CODES.SESSION_EXPIRED)
  }

  return toPublicUser(registeredUser)
}

async function withNetworkSimulation(callback) {
  try {
    await delay()
    return await callback()
  } catch (error) {
    if (error instanceof AuthError) {
      throw error
    }

    throw new AuthError(AUTH_ERROR_CODES.NETWORK_ERROR)
  }
}

export const authService = {
  async login({ email, password }) {
    return withNetworkSimulation(async () => {
      const match = findUserByEmail(email)

      if (!match || match.password !== password) {
        throw new AuthError(AUTH_ERROR_CODES.INVALID_CREDENTIALS)
      }

      const token = createToken(match.user.id)

      return {
        token,
        user: match.user,
      }
    })
  },

  async register({ name, email, password, role }) {
    return withNetworkSimulation(async () => {
      const existing = findUserByEmail(email)

      if (existing) {
        throw new AuthError(AUTH_ERROR_CODES.EMAIL_EXISTS)
      }

      const user = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
      }

      saveMockUser(user, password)

      return {
        user,
        message: 'Registration successful. Please sign in to continue.',
      }
    })
  },

  async logout() {
    return withNetworkSimulation(async () => ({
      message: 'Logged out successfully.',
    }))
  },

  async getCurrentUser(token) {
    return withNetworkSimulation(async () => validateToken(token))
  },
}
