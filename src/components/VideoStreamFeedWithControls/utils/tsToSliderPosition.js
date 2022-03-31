import { SECONDS_IN_DAY } from '../constants'

import tsAtMidnight from './tsAtMidnight'

const tsToSliderPosition = (ts, subtractDays) => {
  // 100% = SEC_IN_DAY
  const diff = ts - tsAtMidnight(subtractDays)
  return (diff / SECONDS_IN_DAY) * 100
}

export default tsToSliderPosition
