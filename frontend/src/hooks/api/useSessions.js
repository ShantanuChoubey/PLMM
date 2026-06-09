import { queryKeys } from '@/constants/queryKeys'
import { sessionService } from '@/services/sessionService'
import { useApiQuery } from '@/hooks/api/useQueryHelpers'

export function useLearnerSessions(params = {}, options = {}) {
  return useApiQuery(queryKeys.sessions.list({ role: 'learner', ...params }), () => sessionService.getLearnerSessions(params), options)
}

export function useMentorSessions(params = {}, options = {}) {
  return useApiQuery(queryKeys.sessions.list({ role: 'mentor', ...params }), () => sessionService.getMentorSessions(params), options)
}

export function useFacultySessions(options = {}) {
  return useApiQuery(queryKeys.faculty.sessions, () => sessionService.getFacultySessions(), options)
}

export function useAdminSessions(params = {}, options = {}) {
  return useApiQuery(queryKeys.admin.sessions(params), () => sessionService.getAdminSessions(params), options)
}
