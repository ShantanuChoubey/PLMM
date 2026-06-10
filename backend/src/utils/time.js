export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

export function isValidTimeFormat(time) {
  return TIME_PATTERN.test(time)
}

export function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function isValidTimeRange(startTime, endTime) {
  return timeToMinutes(endTime) > timeToMinutes(startTime)
}

export function doTimesOverlap(startA, endA, startB, endB) {
  const startMinutesA = timeToMinutes(startA)
  const endMinutesA = timeToMinutes(endA)
  const startMinutesB = timeToMinutes(startB)
  const endMinutesB = timeToMinutes(endB)

  return startMinutesA < endMinutesB && startMinutesB < endMinutesA
}

export function isSlotInFuture(day, startTime, referenceDate = new Date()) {
  const dayIndex = DAYS_OF_WEEK.indexOf(day)

  if (dayIndex === -1) {
    return true
  }

  const currentDayIndex = referenceDate.getDay()
  const slotStartMinutes = timeToMinutes(startTime)
  const currentMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes()

  if (dayIndex > currentDayIndex) {
    return true
  }

  if (dayIndex < currentDayIndex) {
    return true
  }

  return slotStartMinutes > currentMinutes
}
