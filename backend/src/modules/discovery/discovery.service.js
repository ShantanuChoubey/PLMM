import { StatusCodes } from 'http-status-codes'
import { MESSAGES } from '../../constants/messages.js'
import { AppError } from '../../utils/AppError.js'
import { isSlotInFuture } from '../../utils/time.js'
import {
  buildPagination,
  discoveryRepository,
  formatMentorSummary,
} from './discovery.repository.js'

function formatMentorDetail(mentor) {
  const formatted = formatMentorSummary(mentor)

  return {
    ...formatted,
    availability: formatted.availability.filter((slot) =>
      isSlotInFuture(slot.day, slot.startTime),
    ),
  }
}

export const discoveryService = {
  async searchMentors(query) {
    const { sortBy, sortOrder, page, limit, ...filters } = query
    const pagination = buildPagination({ page, limit })

    const [mentors, total] = await Promise.all([
      discoveryRepository.searchMentors({
        filters,
        sort: { sortBy, sortOrder },
        pagination,
      }),
      discoveryRepository.countMentors({ filters }),
    ])

    return {
      mentors: mentors.map(formatMentorSummary),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit) || 0,
      },
    }
  },

  async getMentorDetails(mentorId) {
    const mentor = await discoveryRepository.findMentorById(mentorId)

    if (!mentor || !mentor.user?.isActive) {
      throw new AppError(MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND)
    }

    return formatMentorDetail(mentor)
  },
}
