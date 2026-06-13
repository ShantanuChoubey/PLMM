import { prisma } from '../../database/prisma.js'

// ─── Includes ─────────────────────────────────────────────────────────────────

const groupInclude = {
  creator: {
    select: { id: true, name: true, email: true, avatar: true },
  },
  _count: {
    select: { members: true, resources: true },
  },
}

const groupDetailInclude = {
  ...groupInclude,
  members: {
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true, role: true } },
    },
    orderBy: { joinedAt: 'asc' },
  },
}

// ─── Repository ───────────────────────────────────────────────────────────────

export const groupsRepository = {
  findById(id) {
    return prisma.studyGroup.findUnique({ where: { id }, include: groupInclude })
  },

  findByIdWithDetails(id) {
    return prisma.studyGroup.findUnique({ where: { id }, include: groupDetailInclude })
  },

  findMany({ where = {}, skip = 0, take = 20, orderBy = { createdAt: 'desc' } } = {}) {
    return prisma.studyGroup.findMany({ where, skip, take, orderBy, include: groupInclude })
  },

  count(where = {}) {
    return prisma.studyGroup.count({ where })
  },

  create(data) {
    return prisma.studyGroup.create({ data, include: groupInclude })
  },

  update(id, data) {
    return prisma.studyGroup.update({ where: { id }, data, include: groupInclude })
  },

  delete(id) {
    return prisma.studyGroup.delete({ where: { id } })
  },

  // ─── Members ────────────────────────────────────────────────────────────────

  findMember(groupId, userId) {
    return prisma.groupMember.findUnique({ where: { groupId_userId: { groupId, userId } } })
  },

  addMember(groupId, userId, role = 'MEMBER') {
    return prisma.groupMember.create({
      data: { groupId, userId, role },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true, role: true } },
      },
    })
  },

  removeMember(groupId, userId) {
    return prisma.groupMember.delete({ where: { groupId_userId: { groupId, userId } } })
  },

  getMemberCount(groupId) {
    return prisma.groupMember.count({ where: { groupId } })
  },

  getMembers(groupId) {
    return prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true, role: true } },
      },
      orderBy: { joinedAt: 'asc' },
    })
  },

  // Transfer ownership to next moderator/member when owner leaves
  findNextOwner(groupId, excludeUserId) {
    return prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: { not: excludeUserId },
        role: { in: ['MODERATOR', 'MEMBER'] },
      },
      orderBy: { joinedAt: 'asc' },
    })
  },

  updateMemberRole(groupId, userId, role) {
    return prisma.groupMember.update({
      where: { groupId_userId: { groupId, userId } },
      data: { role },
    })
  },
}
