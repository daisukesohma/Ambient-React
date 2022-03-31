// Timestamp at midnight
// takes optional param
import { SEC_IN_DAY } from './constants'

const tsAtMidnight = (daysBack = 0) => {
  /**
   * Get unix timestamp at midnight
   * @param {number} daysBack
   * */
  const currDay = new Date()
  currDay.setHours(0, 0, 0, 0)
  let currDayTS = Math.round(currDay.getTime() / 1000)
  currDayTS -= SEC_IN_DAY * daysBack
  return currDayTS
}

export default tsAtMidnight
