import moment from 'moment-timezone'

export const isBeforeDay = (a, b) => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false

  const aYear = a.year()
  const aMonth = a.month()

  const bYear = b.year()
  const bMonth = b.month()

  const isSameYear = aYear === bYear
  const isSameMonth = aMonth === bMonth

  if (isSameYear && isSameMonth) return a.date() < b.date()
  if (isSameYear) return aMonth < bMonth
  return aYear < bYear
}

export const isSameDay = (a, b) => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false
  // Compare least significant, most likely to change units first
  // Moment's isSame clones moment inputs and is a tad slow
  return (
    a.date() === b.date() && a.month() === b.month() && a.year() === b.year()
  )
}

export const isWithinDayBackList = (a, dayBackList) => {
  if (!moment.isMoment(a)) return false
  for (let i = 0; i < dayBackList.length; ++i) {
    const listDay = moment().subtract(dayBackList[i], 'days')
    if (a.date() === listDay.date()) {
      return true
    }
  }
  return false
}

export const isAfterDay = (a, b) => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false
  return !isBeforeDay(a, b) && !isSameDay(a, b)
}

export const isInclusivelyBeforeDay = (a, b) => {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false
  return !isAfterDay(a, b)
}
