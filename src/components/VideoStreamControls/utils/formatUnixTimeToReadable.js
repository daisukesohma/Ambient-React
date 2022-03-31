import {
  DEFAULT_TIMEZONE,
  formatUnixTimeWithTZ,
} from 'utils/dateTime/formatTimeWithTZ'

const formatUnixTimeToReadable = (
  unixTs,
  showDate,
  showTime,
  isZoomOut = false,
  timezone = DEFAULT_TIMEZONE,
) => {
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  let resultFormat = ''

  if (showDate) {
    resultFormat = 'M/d/yyyy'
  }

  if (showTime) {
    // Hours part from the timestamp
    if (resultFormat !== '') {
      resultFormat += ' '
    }
    // Will display time in 10:30:23 format
    if (isZoomOut) {
      resultFormat += 'hh:mm'
    } else {
      resultFormat += 'hh:mm:ss'
    }
  }

  return formatUnixTimeWithTZ(unixTs, resultFormat, timezone)
}

export default formatUnixTimeToReadable
