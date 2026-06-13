import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from './env.js'
import { logger } from '../utils/logger.js'

// ─── Gemini client (singleton) ────────────────────────────────────────────────

let _genAI = null
let _model = null

/**
 * Lazily initialise the Gemini client.
 * Returns null (with a warning) when GEMINI_API_KEY is not set,
 * so the server still starts in development without the key.
 */
export function getGeminiModel(modelName = 'gemini-2.5-flash') {
  if (!env.gemini.configured) {
    logger.warn('Gemini API key not set — AI features will be unavailable. Add GEMINI_API_KEY to .env')
    return null
  }

  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(env.gemini.apiKey)
  }

  // Return a fresh model instance per call (cheap, stateless)
  return _genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 2048,
    },
  })
}

/**
 * Verify the Gemini connection by sending a minimal probe request.
 * Used at startup to confirm the key is valid.
 */
export async function verifyGeminiConnection() {
  if (!env.gemini.configured) {
    logger.warn('Gemini not configured — skipping connection check')
    return false
  }

  try {
    const model = getGeminiModel()
    await model.generateContent('ping')
    logger.info('Gemini AI connected successfully')
    return true
  } catch (err) {
    logger.warn(`Gemini connection check failed: ${err.message}`)
    return false
  }
}
