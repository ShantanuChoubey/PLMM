import { Router } from 'express'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  deleteNotification,
  getNotificationById,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from './notifications.controller.js'
import { notifIdParamSchema, notifQuerySchema } from './notifications.validation.js'

const router = Router()

router.use(authenticate)

// GET  /notifications          — list with filters + pagination
router.get('/', validate(notifQuerySchema, 'query'), getNotifications)

// PATCH /notifications/read-all — must come BEFORE /:id to avoid route conflict
router.patch('/read-all', markAllAsRead)

// GET  /notifications/:id
router.get('/:id', validate(notifIdParamSchema, 'params'), getNotificationById)

// PATCH /notifications/:id/read
router.patch('/:id/read', validate(notifIdParamSchema, 'params'), markAsRead)

// DELETE /notifications/:id
router.delete('/:id', validate(notifIdParamSchema, 'params'), deleteNotification)

export default router
