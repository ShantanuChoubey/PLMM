import { Router } from 'express'
import aiRoutes from '../../modules/ai/ai.routes.js'
import goalAnalysisRoutes from '../../modules/goalAnalysis/goalAnalysis.routes.js'
import recommendationsRoutes from '../../modules/recommendations/recommendations.routes.js'
import studyPlanRoutes from '../../modules/studyPlan/studyPlan.routes.js'
import auditRoutes from '../../modules/audit/audit.routes.js'
import authRoutes from '../../modules/auth/auth.routes.js'
import availabilityRoutes from '../../modules/availability/availability.routes.js'
import discoveryRoutes from '../../modules/discovery/discovery.routes.js'
import groupsRoutes from '../../modules/groups/groups.routes.js'
import notificationsRoutes from '../../modules/notifications/notifications.routes.js'
import progressRoutes from '../../modules/progress/progress.routes.js'
import profilesRoutes from '../../modules/profiles/profiles.routes.js'
import resourcesRoutes from '../../modules/resources/resources.routes.js'
import reviewsRoutes from '../../modules/reviews/reviews.routes.js'
import sessionsRoutes from '../../modules/sessions/sessions.routes.js'
import skillsRoutes from '../../modules/skills/skills.routes.js'
import healthRoutes from './health.routes.js'
import testRoutes from './test.routes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/profiles', profilesRoutes)
router.use('/skills', skillsRoutes)
router.use('/availability', availabilityRoutes)
router.use('/mentors', discoveryRoutes)
router.use('/sessions', sessionsRoutes)
router.use('/groups', groupsRoutes)
router.use('/resources', resourcesRoutes)
router.use('/reviews', reviewsRoutes)
router.use('/notifications', notificationsRoutes)
router.use('/progress', progressRoutes)
router.use('/admin/audit-logs', auditRoutes)
router.use('/ai', aiRoutes)
router.use('/ai', recommendationsRoutes)
router.use('/ai', studyPlanRoutes)
router.use('/ai', goalAnalysisRoutes)
router.use('/test', testRoutes)

export default router
