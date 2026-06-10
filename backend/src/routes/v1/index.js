import { Router } from 'express'
import authRoutes from '../../modules/auth/auth.routes.js'
import availabilityRoutes from '../../modules/availability/availability.routes.js'
import discoveryRoutes from '../../modules/discovery/discovery.routes.js'
import profilesRoutes from '../../modules/profiles/profiles.routes.js'
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
router.use('/test', testRoutes)

export default router
