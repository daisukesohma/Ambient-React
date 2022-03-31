import get from 'lodash/get'

import { ActivityTypeEnum } from '../enums'

const getActivityStreamName = activity => {
  switch (get(activity, '__typename')) {
    case ActivityTypeEnum.AccessAlarmType:
      return get(activity, 'reader.stream.name')
    case ActivityTypeEnum.AlertEventType:
      return get(activity, 'stream.name')
    case ActivityTypeEnum.ProfileOverrideLogType:
      return ''
    case ActivityTypeEnum.WorkShiftType:
      return ''
    case ActivityTypeEnum.ThreatSignaturePausePeriodType:
      return activity.streams.map(stream => stream.name).join(', ')
    default:
      return null
  }
}

export default getActivityStreamName
