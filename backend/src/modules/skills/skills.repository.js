import { prisma } from '../../database/prisma.js'

const skillSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
}

const mentorSkillInclude = {
  skill: {
    select: skillSelect,
  },
}

export const skillsRepository = {
  findById(id) {
    return prisma.skill.findUnique({ where: { id } })
  },

  findByName(name) {
    return prisma.skill.findUnique({ where: { name } })
  },

  create(data) {
    return prisma.skill.create({ data })
  },

  update(id, data) {
    return prisma.skill.update({ where: { id }, data })
  },

  delete(id) {
    return prisma.skill.delete({ where: { id } })
  },

  findAll({ filters = {}, pagination = {} } = {}) {
    const { skip = 0, take = 50 } = pagination
    const { search } = filters

    return prisma.skill.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      skip,
      take,
      orderBy: { name: 'asc' },
    })
  },

  count({ filters = {} } = {}) {
    const { search } = filters

    return prisma.skill.count({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
    })
  },

  findMentorSkillById(id) {
    return prisma.mentorSkill.findUnique({
      where: { id },
      include: mentorSkillInclude,
    })
  },

  findMentorSkillByMentorAndSkill(mentorId, skillId) {
    return prisma.mentorSkill.findUnique({
      where: {
        mentorId_skillId: { mentorId, skillId },
      },
    })
  },

  assignSkillToMentor(mentorId, skillId) {
    return prisma.mentorSkill.create({
      data: { mentorId, skillId },
      include: mentorSkillInclude,
    })
  },

  removeMentorSkill(id) {
    return prisma.mentorSkill.delete({ where: { id } })
  },

  findMentorSkills(mentorId) {
    return prisma.mentorSkill.findMany({
      where: { mentorId },
      include: mentorSkillInclude,
      orderBy: { createdAt: 'desc' },
    })
  },
}
