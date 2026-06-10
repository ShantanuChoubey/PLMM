import { prisma } from '../../database/prisma.js'

const mentorInclude = {
  user: {
    select: { id: true, name: true, email: true, role: true, avatar: true, isActive: true },
  },
  skills: {
    include: {
      skill: {
        select: { id: true, name: true, description: true },
      },
    },
  },
  availabilitySlots: {
    where: { isBooked: false },
    orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
  },
}

const FILTER_BUILDERS = {
  skill: (value) => ({
    skills: {
      some: {
        skill: {
          name: { contains: value, mode: 'insensitive' },
        },
      },
    },
  }),

  department: (value) => ({
    OR: [
      { specialization: { contains: value, mode: 'insensitive' } },
      { experience: { contains: value, mode: 'insensitive' } },
      { bio: { contains: value, mode: 'insensitive' } },
    ],
  }),

  rating: (value) => ({
    rating: { gte: Number(value) },
  }),

  availability: (value) => ({
    availabilitySlots: {
      some: {
        day: value,
        isBooked: false,
      },
    },
  }),

  experience: (value) => ({
    experience: { contains: value, mode: 'insensitive' },
  }),

  specialization: (value) => ({
    specialization: { contains: value, mode: 'insensitive' },
  }),
}

const SORT_BUILDERS = {
  rating: (order) => ({ rating: order }),
  experience: (order) => ({ experience: order }),
  sessions: (order) => ({ totalSessions: order }),
  name: (order) => ({ user: { name: order } }),
}

export function buildMentorWhereClause(filters = {}) {
  const conditions = [{ user: { isActive: true } }]

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue

    const builder = FILTER_BUILDERS[key]

    if (builder) {
      conditions.push(builder(value))
    }
  }

  return conditions.length === 1 ? conditions[0] : { AND: conditions }
}

export function buildMentorOrderBy(sortBy = 'rating', sortOrder = 'desc') {
  const builder = SORT_BUILDERS[sortBy] ?? SORT_BUILDERS.rating
  return builder(sortOrder)
}

export function buildPagination({ page = 1, limit = 10 } = {}) {
  const safePage = Math.max(1, Number(page) || 1)
  const safeLimit = Math.min(Math.max(1, Number(limit) || 10), 50)

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  }
}

function formatMentorSkills(skills = []) {
  return skills.map(({ id, skillId, createdAt, skill }) => ({
    assignmentId: id,
    skillId,
    assignedAt: createdAt,
    ...skill,
  }))
}

export function formatMentorSummary(mentor) {
  const { skills, availabilitySlots, user, ...profile } = mentor

  return {
    ...profile,
    user,
    skills: formatMentorSkills(skills),
    availability: availabilitySlots,
  }
}

export const discoveryRepository = {
  searchMentors({ filters = {}, sort = {}, pagination = {} } = {}) {
    const { skip, take } = pagination
    const where = buildMentorWhereClause(filters)
    const orderBy = buildMentorOrderBy(sort.sortBy, sort.sortOrder)

    return prisma.mentorProfile.findMany({
      where,
      skip,
      take,
      orderBy,
      include: mentorInclude,
    })
  },

  countMentors({ filters = {} } = {}) {
    return prisma.mentorProfile.count({
      where: buildMentorWhereClause(filters),
    })
  },

  findMentorById(id) {
    return prisma.mentorProfile.findUnique({
      where: { id },
      include: mentorInclude,
    })
  },
}
