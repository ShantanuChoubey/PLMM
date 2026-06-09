import { queryKeys } from '@/constants/queryKeys'
import { analyticsService } from '@/services/analyticsService'
import { useApiQuery } from '@/hooks/api/useQueryHelpers'

export function usePlatformAnalytics(options = {}) {
  return useApiQuery(queryKeys.analytics.platform, () => analyticsService.getPlatformAnalytics(), options)
}

export function useAdminDashboardAnalytics(options = {}) {
  return useApiQuery(queryKeys.admin.dashboard, () => analyticsService.getAdminDashboard(), options)
}
