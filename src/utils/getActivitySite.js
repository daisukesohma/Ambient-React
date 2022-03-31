import get from 'lodash/get'

import { ActivityTypeEnum } from '../enums'

const getActivitySite = activity => {
  switch (get(activity, '__typename')) {
    case ActivityTypeEnum.AccessAlarmType:
      return get(activity, 'reader.site')
    case ActivityTypeEnum.AlertEventType:
      return get(activity, 'alert.site')
    case ActivityTypeEnum.ProfileOverrideLogType:
      return (
        get(activity, 'overridingSecurityProfile.site') ||
        get(activity, 'overriddenSecurityProfile.site')
      )
    case ActivityTypeEnum.WorkShiftType:
      return ''
    case ActivityTypeEnum.ThreatSignaturePausePeriodType:
      return get(activity, 'site')
    default:
      return null
  }
}

export default getActivitySite
