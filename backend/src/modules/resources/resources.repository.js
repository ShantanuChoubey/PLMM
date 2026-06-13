import { prisma } from '../../database/prisma.js'

// ─── Includes ─────────────────────────────────────────────────────────────────

const resourceInclude = {
  uploader: {
    select: { id: true, name: true, email: true, avatar: true },
  },
  group: {
    select: { id: true, name: true, category: true },
  },
}

// ─── Repository ───────────────────────────────────────────────────────────────

export const resourcesRepository = {
  findById(id) {
    return prisma.resource.findUnique({ where: { id }, include: resourceInclude })
  },

  findRawById(id) {
    return prisma.resource.findUnique({ where: { id } })
  },

  findMany({ where = {}, skip = 0, take = 20, orderBy = { createdAt: 'desc' } } = {}) {
    return prisma.resource.findMany({ where, skip, take, orderBy, include: resourceInclude })
  },

  count(where = {}) {
    return prisma.resource.count({ where })
  },

  create(data) {
    return prisma.resource.create({ data, include: resourceInclude })
  },

  update(id, data) {
    return prisma.resource.update({ where: { id }, data, include: resourceInclude })
  },

  delete(id) {
    return prisma.resource.delete({ where: { id } })
  },

  incrementViews(id) {
    return prisma.resource.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { id: true, views: true },
    })
  },

  incrementDownloads(id) {
    return prisma.resource.update({
      where: { id },
      data: { downloads: { increment: 1 } },
      select: { id: true, downloads: true },
    })
  },
}
