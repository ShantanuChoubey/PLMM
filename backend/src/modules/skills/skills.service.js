import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { AppError } from '../../utils/AppError.js'
import { profilesRepository } from '../profiles/profiles.repository.js'
import { skillsRepository } from './skills.repository.js'

function formatMentorSkillsResponse(mentorProfile, mentorSkills) {
  const { skills: _skills, ...mentor } = mentorProfile

  return {
    mentor,
    skills: mentorSkills.map(({ id, skillId, createdAt, skill }) => ({
      assignmentId: id,
      skillId,
      assignedAt: createdAt,
      ...skill,
    })),
  }
}

export const skillsService = {
  async createSkill(data) {
    const existing = await skillsRepository.findByName(data.name)

    if (existing) {
      throw new AppError(MESSAGES.SKILL_ALREADY_EXISTS, StatusCodes.CONFLICT)
    }

    return skillsRepository.create(data)
  },

  async getSkills({ filters = {}, pagination = {} } = {}) {
    const [skills, total] = await Promise.all([
      skillsRepository.findAll({ filters, pagination }),
      skillsRepository.count({ filters }),
    ])

    return { skills, total, skip: pagination.skip ?? 0, take: pagination.take ?? 50 }
  },

  async getSkillById(id) {
    const skill = await skillsRepository.findById(id)

    if (!skill) {
      throw new AppError(MESSAGES.SKILL_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    return skill
  },

  async updateSkill(id, data) {
    await this.getSkillById(id)

    if (data.name) {
      const existing = await skillsRepository.findByName(data.name)

      if (existing && existing.id !== id) {
        throw new AppError(MESSAGES.SKILL_ALREADY_EXISTS, StatusCodes.CONFLICT)
      }
    }

    return skillsRepository.update(id, data)
  },

  async deleteSkill(id) {
    await this.getSkillById(id)
    await skillsRepository.delete(id)
  },

  async assignSkillToMentor(userId, skillId) {
    const mentorProfile = await profilesRepository.findMentorByUserId(userId)

    if (!mentorProfile) {
      throw new AppError(MESSAGES.MENTOR_PROFILE_REQUIRED, StatusCodes.BAD_REQUEST)
    }

    const skill = await skillsRepository.findById(skillId)

    if (!skill) {
      throw new AppError(MESSAGES.SKILL_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    const existing = await skillsRepository.findMentorSkillByMentorAndSkill(
      mentorProfile.id,
      skillId,
    )

    if (existing) {
      throw new AppError(MESSAGES.SKILL_ALREADY_ASSIGNED, StatusCodes.CONFLICT)
    }

    const assignment = await skillsRepository.assignSkillToMentor(mentorProfile.id, skillId)

    return {
      assignment,
      skill,
    }
  },

  async getMentorSkills(userId) {
    const mentorProfile = await profilesRepository.findMentorByUserId(userId)

    if (!mentorProfile) {
      throw new AppError(MESSAGES.MENTOR_PROFILE_REQUIRED, StatusCodes.BAD_REQUEST)
    }

    const mentorSkills = await skillsRepository.findMentorSkills(mentorProfile.id)

    return formatMentorSkillsResponse(mentorProfile, mentorSkills)
  },

  async removeMentorSkill(userId, assignmentId) {
    const mentorProfile = await profilesRepository.findMentorByUserId(userId)

    if (!mentorProfile) {
      throw new AppError(MESSAGES.MENTOR_PROFILE_REQUIRED, StatusCodes.BAD_REQUEST)
    }

    const assignment = await skillsRepository.findMentorSkillById(assignmentId)

    if (!assignment || assignment.mentorId !== mentorProfile.id) {
      throw new AppError(MESSAGES.MENTOR_SKILL_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    await skillsRepository.removeMentorSkill(assignmentId)
  },
}
