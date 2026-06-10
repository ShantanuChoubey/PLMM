import { Router } from 'express'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { login, logout, getMe, register } from './auth.controller.js'
import { loginSchema, registerSchema } from './auth.validation.js'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, getMe)

export default router
