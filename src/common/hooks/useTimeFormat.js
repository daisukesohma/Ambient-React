import moment from 'moment'

import { TimeFormatEnum } from '../../enums'

export default function useTimeFormat(time, timeFormat) {
  switch (timeFormat) {
    case TimeFormatEnum.TWELVE:
      return `${moment(time).format('hh:mm:ssA')}`
    case TimeFormatEnum.TWENTYFOUR:
      return `${moment(time).format('HH:mm:ss')}`
    default:
      return `${moment(time).format('HH:mm:ss')}`
  }
}
