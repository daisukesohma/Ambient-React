import ActivityTypeEnum from './ActivityTypeEnum'
// TODO: should be used inside of component with useTheme hook OR ideally in makeStyles
import { light as palette } from 'theme'

export default Object.freeze({
  [ActivityTypeEnum.AlertEventType]: palette.error.main,
  [ActivityTypeEnum.AccessAlarmType]: palette.warning.main,
  [ActivityTypeEnum.ProfileOverrideLogType]: palette.warning.light,
  [ActivityTypeEnum.WorkShiftType]: palette.common.greenPastel,
  [ActivityTypeEnum.ThreatSignaturePausePeriodType]: palette.primary.main,
})
