import { toDate } from 'date-fns-tz'

import { DEFAULT_TIMEZONE } from './formatTimeWithTZ'

// TODO: consider using standard date moudle like date-fns, momentjs across the project
const tsAtMidnight = (daysDifference = 0, timezone = DEFAULT_TIMEZONE) => {
  // get ts At Midnight based on the user's timezone
  const todayString = new Date().toLocaleDateString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }) // month/day/year
  const [month, day, year] = todayString.split('/')
  const today = toDate(`${year}-${month}-${day}T00:00:00`, {
    timeZone: timezone,
  })
  return today / 1000 + 86400 * daysDifference
}

export default tsAtMidnight
