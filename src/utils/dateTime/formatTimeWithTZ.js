import { format, utcToZonedTime } from 'date-fns-tz'
import moment from 'moment'
import isNumber from 'lodash/isNumber'

export const DEFAULT_TIMEZONE = 'America/Los_Angeles'

export const formatUnixTimeWithTZ = (
  unix,
  formatString,
  timezone = DEFAULT_TIMEZONE,
) => {
  // TODO: hot fix by Alex. Maybe need to confirm better solution with Jash
  try {
    let dateUnix = unix
    if (!isNumber(unix)) {
      dateUnix = moment().unix()
      console.error(`unix is ${unix} applied fallback value ${dateUnix}`)
    }

    const date = new Date(dateUnix * 1000)
    return format(
      utcToZonedTime(date, timezone || DEFAULT_TIMEZONE),
      formatString,
      {
        timeZone: timezone || DEFAULT_TIMEZONE,
      },
    )
  } catch(err) {
    return 'Invalid Timestamp'
  }
}

export const formatTimeWithTZ = (
  time,
  formatString,
  timezone = DEFAULT_TIMEZONE,
) => formatUnixTimeWithTZ(time / 1000, formatString, timezone)
