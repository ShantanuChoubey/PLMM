import { prisma } from '../../database/prisma.js'

export const availabilityRepository = {
  findById(id) {
    return prisma.availabilitySlot.findUnique({ where: { id } })
  },

  findByMentorId(mentorId, { onlyAvailable = false } = {}) {
    return prisma.availabilitySlot.findMany({
      where: {
        mentorId,
        ...(onlyAvailable && { isBooked: false }),
      },
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
    })
  },

  findExactSlot(mentorId, day, startTime, endTime) {
    return prisma.availabilitySlot.findFirst({
      where: { mentorId, day, startTime, endTime },
    })
  },

  findSlotsByDay(mentorId, day, excludeId) {
    return prisma.availabilitySlot.findMany({
      where: {
        mentorId,
        day,
        ...(excludeId && { id: { not: excludeId } }),
      },
    })
  },

  create(data) {
    return prisma.availabilitySlot.create({ data })
  },

  update(id, data) {
    return prisma.availabilitySlot.update({ where: { id }, data })
  },

  delete(id) {
    return prisma.availabilitySlot.delete({ where: { id } })
  },
}
