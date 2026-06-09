export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const INITIAL_AVAILABILITY_SLOTS = [
  { id: 'slot-1', day: 'Monday', startTime: '18:00', endTime: '19:00', label: '6 PM - 7 PM' },
  { id: 'slot-2', day: 'Wednesday', startTime: '19:00', endTime: '20:00', label: '7 PM - 8 PM' },
  { id: 'slot-3', day: 'Friday', startTime: '17:00', endTime: '18:00', label: '5 PM - 6 PM' },
]

export const AVAILABILITY_SUMMARY = {
  totalSlots: 3,
  weeklyHours: 3,
  timezone: 'EST',
  nextAvailable: 'Monday, 6:00 PM',
}
