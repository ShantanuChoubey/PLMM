import { format, isValid, parseISO } from 'date-fns'

/**
 * Format a time value into a readable string.
 * @param {Date | string | number} date
 * @param {string} pattern
 * @returns {string}
 */
export function formatTime(date, pattern = 'h:mm a') {
  const parsedDate = date instanceof Date ? date : parseISO(String(date))

  if (!isValid(parsedDate)) {
    return ''
  }

  return format(parsedDate, pattern)
}
