import { msToUnix } from '../../../utils'

const tsAtMidnight = daysBack => {
  const currDay = new Date()
  currDay.setHours(0, 0, 0, 0)
  let currDayTS = msToUnix(currDay.getTime())
  currDayTS = daysBack ? currDayTS - 3600 * 24 * daysBack : currDayTS
  return currDayTS
}

export default tsAtMidnight
