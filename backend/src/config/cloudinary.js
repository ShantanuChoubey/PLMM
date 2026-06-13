import { v2 as cloudinary } from 'cloudinary'
import { env } from './env.js'
import { logger } from '../utils/logger.js'

if (env.cloudinary.configured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key:    env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  })
  logger.info('Cloudinary configured successfully')
} else {
  logger.warn('Cloudinary credentials not set — file uploads will be disabled. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env')
}

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {object} options  - folder, resource_type, public_id, etc.
 * @returns {Promise<object>} Cloudinary upload result
 */
export function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'plmm/resources',
      resource_type: 'auto',
      ...options,
    }

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) return reject(error)
        resolve(result)
      })
      .end(buffer)
  })
}

/**
 * Delete a file from Cloudinary by its public_id.
 * @param {string} publicId
 * @param {string} resourceType  'image' | 'video' | 'raw'
 */
export function deleteFromCloudinary(publicId, resourceType = 'raw') {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}

export { cloudinary }
