import { apiGet } from '@/services/mockClient'
import {
  USER_GROWTH_CHART,
  SESSION_TRENDS_CHART,
  MENTOR_ENGAGEMENT_CHART,
  GROUP_ACTIVITY_CHART,
  RESOURCE_USAGE_CHART,
  PLATFORM_HEATMAP,
  PLATFORM_HEALTH,
  ANALYTICS_SUMMARY,
} from '@/mock/analyticsData'
import {
  ADMIN_KPIS,
  ADMIN_RECENT_ACTIVITY,
  GROWTH_METRICS,
  PLATFORM_OVERVIEW,
  TOP_MENTORS,
  POPULAR_GROUPS,
  RECENT_ADMIN_RESOURCES,
} from '@/mock/adminDashboardData'

export const analyticsService = {
  getPlatformAnalytics() {
    return apiGet('/analytics/platform', {
      mockHandler: () => ({
        data: {
          userGrowth: USER_GROWTH_CHART,
          sessionTrends: SESSION_TRENDS_CHART,
          mentorEngagement: MENTOR_ENGAGEMENT_CHART,
          groupActivity: GROUP_ACTIVITY_CHART,
          resourceUsage: RESOURCE_USAGE_CHART,
          heatmap: PLATFORM_HEATMAP,
          health: PLATFORM_HEALTH,
          summary: ANALYTICS_SUMMARY,
        },
      }),
    })
  },

  getAdminDashboard() {
    return apiGet('/admin/analytics/dashboard', {
      mockHandler: () => ({
        data: {
          kpis: ADMIN_KPIS,
          overview: PLATFORM_OVERVIEW,
          recentActivity: ADMIN_RECENT_ACTIVITY,
          growthMetrics: GROWTH_METRICS,
          topMentors: TOP_MENTORS,
          popularGroups: POPULAR_GROUPS,
          recentResources: RECENT_ADMIN_RESOURCES,
          charts: {
            userGrowth: USER_GROWTH_CHART,
            sessionTrends: SESSION_TRENDS_CHART,
            mentorEngagement: MENTOR_ENGAGEMENT_CHART,
            groupActivity: GROUP_ACTIVITY_CHART,
            resourceUsage: RESOURCE_USAGE_CHART,
          },
        },
      }),
    })
  },
}
