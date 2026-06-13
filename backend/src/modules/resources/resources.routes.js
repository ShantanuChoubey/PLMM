import { Router } from 'express'
import { authenticate } from '../../middlewares/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { handleUpload } from '../../middlewares/upload.middleware.js'
import {
  createResource,
  deleteResource,
  getResourceById,
  getResources,
  trackDownload,
  trackView,
  updateResource,
} from './resources.controller.js'
import {
  createResourceSchema,
  resourceIdParamSchema,
  resourceQuerySchema,
  updateResourceSchema,
} from './resources.validation.js'

const router = Router()

router.use(authenticate)

// Create resource — multipart/form-data (file optional, externalUrl alternative)
router.post('/', handleUpload, validate(createResourceSchema), createResource)

// List resources with search/filter
router.get('/', validate(resourceQuerySchema, 'query'), getResources)

// Get resource by ID
router.get('/:id', validate(resourceIdParamSchema, 'params'), getResourceById)

// Update resource metadata
router.patch(
  '/:id',
  validate(resourceIdParamSchema, 'params'),
  validate(updateResourceSchema),
  updateResource,
)

// Delete resource
router.delete('/:id', validate(resourceIdParamSchema, 'params'), deleteResource)

// Track view (increment view count)
router.patch('/:id/view', validate(resourceIdParamSchema, 'params'), trackView)

// Track download (increment download count)
router.patch('/:id/download', validate(resourceIdParamSchema, 'params'), trackDownload)

export default router
