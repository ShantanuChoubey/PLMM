import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { AppError } from '../../utils/AppError.js'
import { isSlotInFuture, doTimesOverlap } from '../../utils/time.js'
import { profilesRepository } from '../profiles/profiles.repository.js'
import { availabilityRepository } from './availability.repository.js'

async function getMentorProfileOrFail(userId) {
  const mentorProfile = await profilesRepository.findMentorByUserId(userId)

  if (!mentorProfile) {
    throw new AppError(MESSAGES.MENTOR_PROFILE_REQUIRED, StatusCodes.BAD_REQUEST)
  }

  return mentorProfile
}

async function validateNoConflicts(mentorId, { day, startTime, endTime }, excludeId) {
  const exactSlot = await availabilityRepository.findExactSlot(mentorId, day, startTime, endTime)

  if (exactSlot && exactSlot.id !== excludeId) {
    throw new AppError(MESSAGES.SLOT_ALREADY_EXISTS, StatusCodes.CONFLICT)
  }

  const sameDaySlots = await availabilityRepository.findSlotsByDay(mentorId, day, excludeId)

  const hasOverlap = sameDaySlots.some((slot) =>
    doTimesOverlap(startTime, endTime, slot.startTime, slot.endTime),
  )

  if (hasOverlap) {
    throw new AppError(MESSAGES.SLOT_OVERLAPPING, StatusCodes.CONFLICT)
  }
}

export const availabilityService = {
  async createSlot(userId, data) {
    const mentorProfile = await getMentorProfileOrFail(userId)
    await validateNoConflicts(mentorProfile.id, data)

    return availabilityRepository.create({
      mentorId: mentorProfile.id,
      ...data,
    })
  },

  async getMySlots(userId) {
    const mentorProfile = await getMentorProfileOrFail(userId)
    return availabilityRepository.findByMentorId(mentorProfile.id)
  },

  async updateSlot(userId, slotId, data) {
    const mentorProfile = await getMentorProfileOrFail(userId)
    const slot = await availabilityRepository.findById(slotId)

    if (!slot || slot.mentorId !== mentorProfile.id) {
      throw new AppError(MESSAGES.SLOT_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    const updatedDay = data.day ?? slot.day
    const updatedStartTime = data.startTime ?? slot.startTime
    const updatedEndTime = data.endTime ?? slot.endTime

    if (data.day !== undefined || data.startTime !== undefined || data.endTime !== undefined) {
      await validateNoConflicts(
        mentorProfile.id,
        { day: updatedDay, startTime: updatedStartTime, endTime: updatedEndTime },
        slotId,
      )
    }

    return availabilityRepository.update(slotId, data)
  },

  async deleteSlot(userId, slotId) {
    const mentorProfile = await getMentorProfileOrFail(userId)
    const slot = await availabilityRepository.findById(slotId)

    if (!slot || slot.mentorId !== mentorProfile.id) {
      throw new AppError(MESSAGES.SLOT_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    await availabilityRepository.delete(slotId)
  },

  async getMentorPublicSlots(mentorId) {
    const mentorProfile = await profilesRepository.findMentorById(mentorId)

    if (!mentorProfile) {
      throw new AppError(MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    const slots = await availabilityRepository.findByMentorId(mentorId, { onlyAvailable: true })

    return slots.filter((slot) => isSlotInFuture(slot.day, slot.startTime))
  },
}
