import multer from 'multer'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '../utils/AppError.js'

// Allowed MIME types mapped to resource types
const ALLOWED_MIME_TYPES = {
  // PDFs / Documents
  'application/pdf': 'PDF',
  'application/msword': 'DOCUMENT',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCUMENT',
  // Presentations
  'application/vnd.ms-powerpoint': 'PRESENTATION',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PRESENTATION',
  // Images (used for thumbnails / infographics)
  'image/jpeg': 'IMAGE',
  'image/png': 'IMAGE',
  'image/gif': 'IMAGE',
  'image/webp': 'IMAGE',
  // Videos
  'video/mp4': 'VIDEO',
  'video/webm': 'VIDEO',
  // Text / Notes
  'text/plain': 'DOCUMENT',
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

// Store files in memory so we can stream them to Cloudinary
const storage = multer.memoryStorage()

function fileFilter(_req, file, callback) {
  if (ALLOWED_MIME_TYPES[file.mimetype]) {
    callback(null, true)
  } else {
    callback(
      new AppError(
        `File type "${file.mimetype}" is not allowed. Accepted: PDF, Word, PowerPoint, images, video, text.`,
        StatusCodes.UNPROCESSABLE_ENTITY,
      ),
      false,
    )
  }
}

export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('file')

/**
 * Express middleware wrapper — converts multer callback errors to AppErrors
 * so they flow through our global error handler.
 */
export function handleUpload(req, res, next) {
  uploadSingle(req, res, (err) => {
    if (!err) return next()

    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB`, StatusCodes.UNPROCESSABLE_ENTITY))
    }
    if (err instanceof multer.MulterError) {
      return next(new AppError(err.message, StatusCodes.BAD_REQUEST))
    }
    return next(err)
  })
}

export { ALLOWED_MIME_TYPES }
