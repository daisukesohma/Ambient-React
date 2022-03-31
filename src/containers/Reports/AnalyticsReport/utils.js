import moment from 'moment-timezone'
import { TimeRangeEnum } from 'enums'

const DEFAULT_TIMEZONE = 'America/Los_Angeles'

const timeRangeToCompare = value => {
  if (value <= TimeRangeEnum.DAY) {
    return {
      offset: -TimeRangeEnum.DAY,
      label: 'Previous day',
    }
  }
  if (value <= TimeRangeEnum.WEEK) {
    return {
      offset: -TimeRangeEnum.WEEK,
      label: 'Previous Week',
    }
  }
  if (value <= TimeRangeEnum.MONTH) {
    return {
      offset: -TimeRangeEnum.MONTH,
      label: 'Previous Month',
    }
  }

  return {
    offset: -TimeRangeEnum.YEAR,
    label: 'Previous Year',
  }
}

const formatTimeForAxis = (ts, breakdown, fmt, timezone = DEFAULT_TIMEZONE) => {
  if (fmt && fmt !== 'timestamp') {
    return ts
  }

  let format = 'YYYY/MM/DD'

  if (breakdown < TimeRangeEnum.DAY) {
    format = 'HH:mm'
  } else if (breakdown < TimeRangeEnum.MONTH) {
    format = 'ddd, MM/DD'
  }
  return moment
    .unix(parseInt(ts, 10))
    .tz(timezone)
    .format(format)
}

const getDateTimeForAxis = (ts, fmt, timezone = DEFAULT_TIMEZONE) => {
  if (fmt && fmt !== 'timestamp') {
    return ts
  }

  // return utcToZonedTime(new Date(parseInt(ts, 10) * 1000), timezone)
  return moment.unix(parseInt(ts, 10)).tz(timezone)
}

const formatTimeForTooltip = (
  ts,
  breakdown,
  fmt,
  timezone = DEFAULT_TIMEZONE,
) => {
  if (fmt && fmt !== 'timestamp') {
    return ts
  }

  let format = 'ddd, YYYY/MM/DD'
  if (breakdown < TimeRangeEnum.DAY) {
    format = 'ddd, MM/DD HH:mm'
  } else if (breakdown < TimeRangeEnum.MONTH) {
    format = 'ddd, MM/DD'
  }

  return moment
    .unix(parseInt(ts, 10))
    .tz(timezone)
    .format(format)
}

// dynamically truncates string based on a pixel width
// this flows slightly outside the width based on the elliipsis
// we can use the 3*6px for the ellipses as an option and part of the calculation to
// if the width is a hard stop width.
// this works for an axis pretty well.
const truncateStringByPxWidth = (widthInPx, str) => {
  if (!str) {
    return ''
  }
  const pxPerLetter = 6
  const maxLetters = widthInPx / pxPerLetter

  if (str.length <= maxLetters) {
    return str
  }
  return `${str.slice(0, maxLetters)}...`
}

const truncateStringByPxWidthEnd = (widthInPx, str) => {
  if (!str) {
    return ''
  }
  const pxPerLetter = 6
  const maxLetters = widthInPx / pxPerLetter

  if (str.length <= maxLetters) {
    return str
  }
  return `...${str.slice(str.length - maxLetters, str.length)}`
}

const formatChartNumbers = d => {
  if (d >= 1000) {
    return `${(d / 1000).toFixed(1)}k`
  }
  return d
}

export {
  timeRangeToCompare,
  getDateTimeForAxis,
  formatTimeForAxis,
  formatTimeForTooltip,
  truncateStringByPxWidth,
  truncateStringByPxWidthEnd,
  formatChartNumbers,
}
