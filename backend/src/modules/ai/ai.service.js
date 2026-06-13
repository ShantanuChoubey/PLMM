import { StatusCodes } from 'http-status-codes'
import { getGeminiModel } from '../../config/gemini.js'
import { env } from '../../config/env.js'
import { AppError } from '../../utils/AppError.js'
import { MESSAGES } from '../../constants/messages.js'
import { promptBuilder } from '../../utils/aiPromptBuilder.js'

// ─── Guard helper ─────────────────────────────────────────────────────────────

function requireGemini() {
  if (!env.gemini.configured) {
    throw new AppError(MESSAGES.AI_NOT_CONFIGURED, StatusCodes.SERVICE_UNAVAILABLE)
  }
  return getGeminiModel()
}

// ─── Core AI functions ────────────────────────────────────────────────────────

export const aiService = {
  /**
   * generateText()
   * Send any raw prompt to Gemini and return the text response.
   * Used internally by higher-level functions.
   *
   * @param {string} prompt
   * @returns {Promise<string>}
   */
  async generateText(prompt) {
    const model = requireGemini()

    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      if (!text) throw new Error('Empty response from Gemini')
      return text
    } catch (err) {
      // Re-throw AppErrors as-is; wrap everything else
      if (err instanceof AppError) throw err
      throw new AppError(
        `${MESSAGES.AI_GENERATION_FAILED}: ${err.message}`,
        StatusCodes.BAD_GATEWAY,
      )
    }
  },

  /**
   * generateStructuredResponse()
   * Wraps the prompt with the general PLMM system context,
   * then returns the raw text. Use for free-form educational answers.
   *
   * @param {string} userPrompt
   * @returns {Promise<string>}
   */
  async generateStructuredResponse(userPrompt) {
    const wrappedPrompt = promptBuilder.general(userPrompt)
    return this.generateText(wrappedPrompt)
  },

  /**
   * generateJSONResponse()
   * Send a prompt that expects a JSON reply.
   * Parses and validates the response before returning.
   *
   * @param {string} prompt  - must instruct Gemini to respond with JSON only
   * @returns {Promise<object>}
   */
  async generateJSONResponse(prompt) {
    const text = await this.generateText(prompt)

    // Strip markdown code fences if Gemini wraps JSON in ```json ... ```
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim()

    try {
      return JSON.parse(cleaned)
    } catch {
      throw new AppError(
        `${MESSAGES.AI_INVALID_JSON}: Gemini returned non-JSON output`,
        StatusCodes.BAD_GATEWAY,
      )
    }
  },

  /**
   * testConnection()
   * Lightweight check — sends a minimal prompt and returns true on success.
   */
  async testConnection() {
    const text = await this.generateText('Say "PLMM AI ready" and nothing else.')
    return { connected: true, response: text.trim() }
  },
}
