import { prisma } from '../../database/prisma.js'

const learnerInclude = {
  user: {
    select: { id: true, name: true, email: true, role: true, avatar: true },
  },
}

const mentorInclude = {
  user: {
    select: { id: true, name: true, email: true, role: true, avatar: true },
  },
  skills: {
    include: {
      skill: true,
    },
  },
}

const facultyInclude = {
  user: {
    select: { id: true, name: true, email: true, role: true, avatar: true },
  },
}

export const profilesRepository = {
  findLearnerByUserId(userId) {
    return prisma.learnerProfile.findUnique({
      where: { userId },
      include: learnerInclude,
    })
  },

  createLearner(data) {
    return prisma.learnerProfile.create({
      data,
      include: learnerInclude,
    })
  },

  updateLearner(userId, data) {
    return prisma.learnerProfile.update({
      where: { userId },
      data,
      include: learnerInclude,
    })
  },

  findLearnerProfiles({ filters = {}, pagination = {} } = {}) {
    const { skip = 0, take = 20 } = pagination
    const { department, year } = filters

    return prisma.learnerProfile.findMany({
      where: {
        ...(department && { department: { contains: department, mode: 'insensitive' } }),
        ...(year && { year }),
      },
      skip,
      take,
      include: learnerInclude,
      orderBy: { createdAt: 'desc' },
    })
  },

  findMentorByUserId(userId) {
    return prisma.mentorProfile.findUnique({
      where: { userId },
      include: mentorInclude,
    })
  },

  findMentorById(id) {
    return prisma.mentorProfile.findUnique({
      where: { id },
      include: mentorInclude,
    })
  },

  createMentor(data) {
    return prisma.mentorProfile.create({
      data,
      include: mentorInclude,
    })
  },

  updateMentor(userId, data) {
    return prisma.mentorProfile.update({
      where: { userId },
      data,
      include: mentorInclude,
    })
  },

  findMentorProfiles({ filters = {}, pagination = {} } = {}) {
    const { skip = 0, take = 20 } = pagination
    const { specialization, minRating, skillIds } = filters

    return prisma.mentorProfile.findMany({
      where: {
        ...(specialization && {
          specialization: { contains: specialization, mode: 'insensitive' },
        }),
        ...(minRating !== undefined && { rating: { gte: minRating } }),
        ...(skillIds?.length && {
          skills: {
            some: {
              skillId: { in: skillIds },
            },
          },
        }),
      },
      skip,
      take,
      include: mentorInclude,
      orderBy: { rating: 'desc' },
    })
  },

  findFacultyByUserId(userId) {
    return prisma.facultyProfile.findUnique({
      where: { userId },
      include: facultyInclude,
    })
  },

  createFaculty(data) {
    return prisma.facultyProfile.create({
      data,
      include: facultyInclude,
    })
  },

  updateFaculty(userId, data) {
    return prisma.facultyProfile.update({
      where: { userId },
      data,
      include: facultyInclude,
    })
  },

  findFacultyProfiles({ filters = {}, pagination = {} } = {}) {
    const { skip = 0, take = 20 } = pagination
    const { department, expertise } = filters

    return prisma.facultyProfile.findMany({
      where: {
        ...(department && { department: { contains: department, mode: 'insensitive' } }),
        ...(expertise && { expertise: { contains: expertise, mode: 'insensitive' } }),
      },
      skip,
      take,
      include: facultyInclude,
      orderBy: { createdAt: 'desc' },
    })
  },
}
