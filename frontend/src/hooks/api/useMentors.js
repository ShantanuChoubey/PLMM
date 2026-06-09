import { queryKeys } from '@/constants/queryKeys'
import { mentorService } from '@/services/mentorService'
import { useApiQuery } from '@/hooks/api/useQueryHelpers'

export function useMentors(params = {}, options = {}) {
  return useApiQuery(queryKeys.mentors.list(params), () => mentorService.getMentors(params), options)
}

export function useMentor(id, options = {}) {
  return useApiQuery(queryKeys.mentors.detail(id), () => mentorService.getMentorById(id), {
    enabled: Boolean(id),
    ...options,
  })
}

export function useMentorMeta(options = {}) {
  return useApiQuery(queryKeys.mentors.meta, () => mentorService.getMeta(), options)
}

export function useMentorProfile(options = {}) {
  return useApiQuery(queryKeys.mentors.profile, () => mentorService.getProfile(), options)
}

export function useMentorDashboard(options = {}) {
  return useApiQuery(['mentors', 'dashboard'], () => mentorService.getDashboardMetrics(), options)
}
