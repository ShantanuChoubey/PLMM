import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { AppError } from '../../utils/AppError.js'
import { profilesRepository } from './profiles.repository.js'

function stripUserFromProfile(profile) {
  if (!profile) return null

  const { user, ...profileData } = profile
  return { ...profileData, user }
}

export const profilesService = {
  async createLearnerProfile(userId, data) {
    const existing = await profilesRepository.findLearnerByUserId(userId)

    if (existing) {
      throw new AppError(MESSAGES.PROFILE_ALREADY_EXISTS, StatusCodes.CONFLICT)
    }

    const profile = await profilesRepository.createLearner({ userId, ...data })
    return stripUserFromProfile(profile)
  },

  async getLearnerProfile(userId) {
    const profile = await profilesRepository.findLearnerByUserId(userId)

    if (!profile) {
      throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    return stripUserFromProfile(profile)
  },

  async updateLearnerProfile(userId, data) {
    const existing = await profilesRepository.findLearnerByUserId(userId)

    if (!existing) {
      throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    const profile = await profilesRepository.updateLearner(userId, data)
    return stripUserFromProfile(profile)
  },

  async createMentorProfile(userId, data) {
    const existing = await profilesRepository.findMentorByUserId(userId)

    if (existing) {
      throw new AppError(MESSAGES.PROFILE_ALREADY_EXISTS, StatusCodes.CONFLICT)
    }

    const profile = await profilesRepository.createMentor({ userId, ...data })
    return stripUserFromProfile(profile)
  },

  async getMentorProfile(userId) {
    const profile = await profilesRepository.findMentorByUserId(userId)

    if (!profile) {
      throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    return stripUserFromProfile(profile)
  },

  async updateMentorProfile(userId, data) {
    const existing = await profilesRepository.findMentorByUserId(userId)

    if (!existing) {
      throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    const profile = await profilesRepository.updateMentor(userId, data)
    return stripUserFromProfile(profile)
  },

  async createFacultyProfile(userId, data) {
    const existing = await profilesRepository.findFacultyByUserId(userId)

    if (existing) {
      throw new AppError(MESSAGES.PROFILE_ALREADY_EXISTS, StatusCodes.CONFLICT)
    }

    const profile = await profilesRepository.createFaculty({ userId, ...data })
    return stripUserFromProfile(profile)
  },

  async getFacultyProfile(userId) {
    const profile = await profilesRepository.findFacultyByUserId(userId)

    if (!profile) {
      throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    return stripUserFromProfile(profile)
  },

  async updateFacultyProfile(userId, data) {
    const existing = await profilesRepository.findFacultyByUserId(userId)

    if (!existing) {
      throw new AppError(MESSAGES.PROFILE_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    const profile = await profilesRepository.updateFaculty(userId, data)
    return stripUserFromProfile(profile)
  },
}
