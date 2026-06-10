import { prisma } from '../../database/prisma.js'

export const authRepository = {
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  },

  findById(id) {
    return prisma.user.findUnique({ where: { id } })
  },

  create(data) {
    return prisma.user.create({ data })
  },
}
