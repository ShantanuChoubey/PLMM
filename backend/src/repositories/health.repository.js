import { prisma } from '../database/prisma.js'

export const healthRepository = {
  async pingDatabase() {
    await prisma.$queryRaw`SELECT 1`
    return true
  },

  async countHealthRecords() {
    return prisma.systemHealth.count()
  },
}
