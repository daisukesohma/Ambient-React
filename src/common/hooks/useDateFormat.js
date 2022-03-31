import moment from 'moment'

import { DateFormatEnum } from '../../enums'

export default function useDateFormat(time, dateFormat) {
  switch (dateFormat) {
    case DateFormatEnum.LONG:
      return `${moment(time).format('ddd MM/DD/YY')}`
    case DateFormatEnum.SHORT:
      return `${moment(time).format('l')}`
    default:
      return `${moment(time).format('l')}`
  }
}
