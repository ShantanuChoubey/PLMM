import { asyncHandler } from '../utils/asyncHandler.js'
import { healthService } from '../services/health.service.js'

export const getHealth = asyncHandler(async (req, res) => {
  const result = healthService.getHealthStatus()
  return res.status(200).json(result)
})
