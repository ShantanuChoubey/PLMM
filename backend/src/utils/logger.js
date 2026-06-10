import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from '../config/env.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logsDir = path.resolve(__dirname, '../../logs')

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

function formatMessage(level, message, meta) {
  const timestamp = new Date().toISOString()
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`
  if (meta !== undefined) {
    return `${base} ${typeof meta === 'string' ? meta : JSON.stringify(meta)}`
  }
  return base
}

function writeToFile(level, formatted) {
  if (env.isProduction) {
    const filePath = path.join(logsDir, `${level}.log`)
    fs.appendFileSync(filePath, `${formatted}\n`)
  }
}

export const logger = {
  info(message, meta) {
    const formatted = formatMessage('info', message, meta)
    if (env.isDevelopment) console.log(formatted)
    writeToFile('info', formatted)
  },

  warn(message, meta) {
    const formatted = formatMessage('warn', message, meta)
    if (env.isDevelopment) console.warn(formatted)
    writeToFile('warn', formatted)
  },

  error(message, meta) {
    const formatted = formatMessage('error', message, meta)
    console.error(formatted)
    writeToFile('error', formatted)
  },
}
